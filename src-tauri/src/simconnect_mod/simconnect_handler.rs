use crate::events::bundle::Bundle;
use crate::events::input::Input;
use crate::events::input_registry::InputRegistry;
use crate::events::output::Output;
use crate::events::output_registry::OutputRegistry;
use crate::events::run_bundle::RunBundle;
use crate::events::sim_command;
use lazy_static::lazy_static;
use serialport::SerialPort;
use simconnect::DWORD;
use simconnect::SIMCONNECT_CLIENT_EVENT_ID;
use std::collections::HashMap;
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
    active_com_ports: Vec<Box<dyn SerialPort>>,
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
            active_com_ports: vec![],
        }
    }

    fn connect_to_devices(&mut self, run_bundles: &Vec<RunBundle>) {
        println!("Connecting to devices");
        for run_bundle in run_bundles.iter() {
            let parts: Vec<&str> = run_bundle.com_port.split(",").collect();
            let com_port: String = match parts.first() {
                Some(x) => x.to_string(),
                None => {
                    continue;
                }
            };
            println!("Com port: {}", com_port);
            let serial_conn = match serialport::new(com_port, 115200).open() {
                Ok(port) => {
                    &self.active_com_ports.push(port);
                    self.active_com_ports
                        .first_mut()
                        .unwrap()
                        .write_all("900 123750".as_bytes());
                }
                Err(e) => {
                    println!("Failed to open port: {}", e);
                }
            };
        }
    }

    pub fn start_connection(&mut self, run_bundles: Vec<RunBundle>) {
        println!("length: {}", run_bundles.len());
        println!("Starting connection");
        self.connect_to_devices(&run_bundles);
        self.initialize_connection();
        loop {
            self.poll_simconnect_message_queue();
            sleep(Duration::from_secs(self.polling_interval as u64));
        }
    }

    pub fn check_if_output_in_bundle(
        &mut self,
        output_to_find: &Output,
        run_bundles: &[RunBundle],
    ) {
        for run_bundle in run_bundles.iter() {
            match run_bundle
                .bundle
                .outputs
                .iter()
                .find(|&output| output.id == output_to_find.id)
            {
                Some(x) => self.send_output_to_device(x, &run_bundle.com_port),
                None => (),
            }
        }
    }

    pub fn send_output_to_device(&mut self, output: &Output, com_port: &str) {
        //TODO send output to comport
        let mut port = serialport::new(com_port, 115200)
            .timeout(Duration::from_millis(10))
            .open()
            .expect("Failed to open port");
        port.write_all(output.id.to_string().as_bytes())
            .expect("Sending the output failed");
    }

    pub fn initialize_connection(&mut self) {
        println!("Initializing connection");
        self.simconnect.connect("Bits and Droids connector");
        self.input_registry.load_inputs();
        self.output_registry.load_outputs();
        self.define_inputs(self.input_registry.get_inputs());
        self.define_outputs(self.output_registry.get_outputs());
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
                                    println!("{}", prefix);
                                    println!("{}", value);
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
                        0 => {
                            println!("1");
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

    pub fn define_inputs(&self, inputs: &HashMap<i32, Input>) {
        for input in inputs {
            self.simconnect.map_client_event_to_sim_event(
                input.0.clone() as SIMCONNECT_CLIENT_EVENT_ID,
                input.1.event.as_str(),
            );
        }
    }
    pub fn define_outputs(&self, outputs: &Vec<Output>) {
        for output in outputs {
            self.simconnect.add_data_definition(
                RequestModes::FLOAT,
                &*output.output_name,
                &*output.metric,
                simconnect::SIMCONNECT_DATATYPE_SIMCONNECT_DATATYPE_FLOAT64,
                output.id,
                output.update_every,
            );
            println!("Output: {:?}", output);
        }
    }
}
