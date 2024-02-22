use crate::events::input::Input;
use crate::events::input_registry::InputRegistry;
use crate::events::output_registry::OutputRegistry;
use crate::events::run_bundle::RunBundle;
use crate::events::sim_command;
use lazy_static::lazy_static;
use serialport::SerialPort;
use simconnect::DWORD;
use simconnect::SIMCONNECT_CLIENT_EVENT_ID;
use std::collections::HashMap;
use std::io::Read;
use std::sync::mpsc;
use std::sync::Arc;
use std::sync::Mutex;
use std::thread::sleep;
use std::time::Duration;

const MAX_RETURNED_ITEMS: usize = 255;

lazy_static! {
    static ref SENDER: Arc<Mutex<Option<mpsc::Sender<sim_command::SimCommand>>>> =
        Arc::new(Mutex::new(None));
}

#[derive(Clone)]
struct Event {
    id: DWORD,
    description: &'static str,
}

#[derive(Clone)]
struct Events {
    available_events: HashMap<DWORD, Event>,
    sim_start: Event,
}

impl Events {
    fn new() -> Self {
        let mut available_events: HashMap<DWORD, Event> = HashMap::new();
        let sim_start: Event = Event {
            id: 0,
            description: "SimStart",
        };

        available_events.insert(0, sim_start.clone());

        Self {
            available_events,
            sim_start,
        }
    }
}

#[repr(C, packed)]
struct DataStruct {
    id: DWORD,
    value: f64,
}

struct StringStruct {
    id: DWORD,
    //string 256
    value: [u8; MAX_RETURNED_ITEMS],
}

struct DataStructContainer {
    data: [DataStruct; MAX_RETURNED_ITEMS],
}

struct RequestModes {
    float: DWORD,
    string: DWORD,
}

impl RequestModes {
    const FLOAT: DWORD = 0;
    const STRING: DWORD = 1;
}

#[derive(Debug)]
pub struct SimconnectHandler {
    pub(crate) simconnect: simconnect::SimConnector,
    pub(crate) input_registry: InputRegistry,
    pub(crate) output_registry: OutputRegistry,
    pub(crate) rx: mpsc::Receiver<sim_command::SimCommand>,
    active_com_ports: HashMap<String, Box<dyn SerialPort>>,
    run_bundles: Vec<RunBundle>,
    polling_interval: u8,
}

// define the payload struct
#[derive(Clone, serde::Serialize)]
struct Payload {
    message: String,
}

impl SimconnectHandler {
    pub fn new(rx: mpsc::Receiver<sim_command::SimCommand>) -> Self {
        let mut simconnect = simconnect::SimConnector::new();
        simconnect.connect("Tauri Simconnect");
        let input_registry = InputRegistry::new();
        let output_registry = OutputRegistry::new();
        Self {
            simconnect,
            input_registry,
            output_registry,
            rx,
            polling_interval: 6,
            active_com_ports: HashMap::new(),
            run_bundles: vec![],
        }
    }

    fn parse_com_port(com_port: &str) -> String {
        let parts: Vec<&str> = com_port.split(',').collect();
        match parts.first() {
            Some(x) => x.to_string(),
            None => "".to_string(),
        }
    }

    fn set_com_ports(&mut self) {
        for run_bundle in &mut self.run_bundles {
            let parsed_com_port = Self::parse_com_port(&run_bundle.com_port);
            run_bundle.com_port = parsed_com_port
        }
    }

    fn connect_to_devices(&mut self) {
        println!("Connecting to devices");
        for run_bundle in self.run_bundles.iter() {
            let com_port = run_bundle.com_port.clone();
            match serialport::new(com_port.clone(), 115200).open() {
                Ok(port) => {
                    self.active_com_ports.insert(com_port, port);
                }
                Err(e) => {
                    println!("Failed to open port: {}", e);
                }
            };
        }
    }

    pub fn start_connection(&mut self, run_bundles: Vec<RunBundle>) {
        self.run_bundles = run_bundles;
        self.set_com_ports();
        self.connect_to_devices();
        self.initialize_connection();
        loop {
            self.poll_simconnect_message_queue();
            sleep(Duration::from_secs(self.polling_interval as u64));
        }
    }

    fn send_input_to_simconnect(&self, command: DWORD) {
        //TODO send input to simconnect
        match self.input_registry.get_input(command) {
            Some(input) => {
                self.simconnect.transmit_client_event(
                    0,
                    input.input_id,
                    0,
                    simconnect::SIMCONNECT_GROUP_PRIORITY_HIGHEST,
                    simconnect::SIMCONNECT_EVENT_FLAG_GROUPID_IS_PRIORITY,
                );
            }
            _ => {
                println!("Input not found: {}", command);
            }
        }
    }

    pub fn check_if_output_in_bundle(&mut self, output_id: u32, value: f64) {
        let mut com_ports = vec![];
        for run_bundle in self.run_bundles.iter() {
            if run_bundle
                .bundle
                .outputs
                .iter()
                .any(|output| output.id == output_id)
            {
                com_ports.push(run_bundle.com_port.clone())
            }
        }

        for com_port in com_ports {
            self.send_output_to_device(output_id, &com_port, value);
        }
    }

    pub fn send_output_to_device(&mut self, output_id: u32, com_port: &str, value: f64) {
        let formatted_str = format!("{} {}\n", output_id, value);
        //TODO send output to comport
        match self.active_com_ports.get_mut(com_port) {
            Some(port) => {
                port.write_all(formatted_str.as_bytes())
                    .expect("Sending the output failed");
            }
            None => {
                println!("Port not found: {}", com_port);
            }
        }
    }

    fn poll_microcontroller_for_inputs(&mut self) {
        let mut messages: Vec<String> = Vec::new();
        for active_com_port in &mut self.active_com_ports {
            let mut buffer: Vec<u8> = Vec::new();
            let mut byte = [0u8; 1];
            let mut reading = true;
            if active_com_port.1.bytes_to_read().unwrap() > 0 {
                while reading {
                    match active_com_port.1.read(&mut byte) {
                        Ok(_) => {
                            if byte[0] == b'\n' {
                                let message = String::from_utf8_lossy(&buffer);
                                messages.push(message.to_string());
                                buffer.clear();
                                //set buffer to \n
                                buffer.push(byte[0]);
                                reading = false;
                            } else if byte[0] != b'\r' {
                                buffer.push(byte[0]);
                            }
                        }
                        Err(e) => eprintln!("{:?}", e),
                    }
                }
            }
        }
        for message in messages {
            //parse message to u32 and send to simconnect
            match message.trim().parse::<DWORD>() {
                Ok(dword) => {
                    self.send_input_to_simconnect(dword);
                }
                Err(e) => eprintln!("{:?}", e),
            }
        }
    }

    pub fn initialize_connection(&mut self) {
        println!("Initializing connection");
        self.simconnect.connect("Bits and Droids connector");
        self.input_registry.load_inputs();
        self.output_registry.load_outputs();
        self.define_inputs(self.input_registry.get_inputs());
        self.define_outputs();
    }

    fn poll_simconnect_message_queue(&mut self) {
        self.simconnect.add_data_definition(
            RequestModes::STRING,
            "TITLE",
            "",
            simconnect::SIMCONNECT_DATATYPE_SIMCONNECT_DATATYPE_STRING256,
            202,
            0.0,
        );
        self.simconnect.request_data_on_sim_object(
            0,
            RequestModes::FLOAT,
            0,
            simconnect::SIMCONNECT_PERIOD_SIMCONNECT_PERIOD_SIM_FRAME,
            simconnect::SIMCONNECT_CLIENT_DATA_REQUEST_FLAG_CHANGED
                | simconnect::SIMCONNECT_CLIENT_DATA_REQUEST_FLAG_TAGGED,
            0,
            1,
            0,
        );
        self.simconnect.request_data_on_sim_object(
            1,
            RequestModes::STRING,
            0,
            simconnect::SIMCONNECT_PERIOD_SIMCONNECT_PERIOD_SIM_FRAME,
            simconnect::SIMCONNECT_CLIENT_DATA_REQUEST_FLAG_CHANGED
                | simconnect::SIMCONNECT_CLIENT_DATA_REQUEST_FLAG_TAGGED,
            0,
            1,
            0,
        );
        let events = Events::new();
        loop {
            self.poll_microcontroller_for_inputs();
            match self.rx.try_recv() {
                Ok(sim_command::SimCommand::NewCommand(command)) => {
                    println!("Command in thread: {}", command);
                    self.simconnect.transmit_client_event(
                        0,
                        command as u32,
                        0,
                        simconnect::SIMCONNECT_GROUP_PRIORITY_HIGHEST,
                        simconnect::SIMCONNECT_EVENT_FLAG_GROUPID_IS_PRIORITY,
                    );
                }
                Err(mpsc::TryRecvError::Empty) => (),
                Err(mpsc::TryRecvError::Disconnected) => {
                    println!("Disconnected");
                    break;
                }
            }
            match self.simconnect.get_next_message() {
                Ok(simconnect::DispatchResult::SimObjectData(data)) => {
                    match data.dwDefineID {
                        RequestModes::FLOAT => {
                            unsafe {
                                let sim_data_ptr =
                                    std::ptr::addr_of!(data.dwData) as *const DataStructContainer;
                                let sim_data_value = std::ptr::read_unaligned(sim_data_ptr);
                                let count = data.dwDefineCount as usize;
                                println!("{}", count);
                                // itterate through the array of data structs
                                for i in 0..count {
                                    let value = sim_data_value.data[i].value;
                                    let prefix = sim_data_value.data[i].id;
                                    println!("{}: {}", prefix, value);
                                    self.check_if_output_in_bundle(prefix, value);
                                    std::thread::sleep(std::time::Duration::from_millis(0));
                                }
                            }
                        }
                        RequestModes::STRING => {
                            unsafe {
                                println!("2 strings");
                                let sim_data_ptr =
                                    std::ptr::addr_of!(data.dwData) as *const StringStruct;
                                let sim_data_value = std::ptr::read_unaligned(sim_data_ptr);
                                //byte array to string
                                let string = std::str::from_utf8(&sim_data_value.value).unwrap();
                                println!("{}", string);
                            }
                        }
                        _ => (),
                    }
                }
                Ok(simconnect::DispatchResult::Event(data)) => {
                    // handle Event variant ...
                    let sim_data_ptr = std::ptr::addr_of!(data.dwData) as *const DWORD;
                    let sim_data_value =
                        unsafe { std::ptr::read_unaligned(sim_data_ptr).to_string() };
                    println!(
                        "EVENT {}",
                        events
                            .available_events
                            .get(&sim_data_value.parse::<DWORD>().unwrap())
                            .unwrap()
                            .description
                    );
                }
                _ => (),
            }
            sleep(Duration::from_millis(16));
        }
    }

    pub fn define_inputs(&self, inputs: &HashMap<u32, Input>) {
        for input in inputs {
            self.simconnect.map_client_event_to_sim_event(
                *input.0 as SIMCONNECT_CLIENT_EVENT_ID,
                input.1.event.as_str(),
            );
        }
    }

    pub fn define_outputs(&self) {
        let run_bundles = &self.run_bundles;
        for run_bundle in run_bundles {
            for output in &run_bundle.bundle.outputs {
                self.simconnect.add_data_definition(
                    RequestModes::FLOAT,
                    &output.output_name,
                    &output.metric,
                    simconnect::SIMCONNECT_DATATYPE_SIMCONNECT_DATATYPE_FLOAT64,
                    output.id,
                    output.update_every,
                );
            }
        }
    }
}
