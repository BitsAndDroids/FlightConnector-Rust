use connector_types::types::connector_settings::ConnectorSettings;
use connector_types::types::input::InputType;
use connector_types::types::wasm_event::WasmEvent;
use lazy_static::lazy_static;
use log::{error, info};
use serde::Deserialize;
use serde::Serialize;
use serialport::SerialPort;
use simconnect::DWORD;
use simconnect::SIMCONNECT_CLIENT_EVENT_ID;
use std::collections::HashMap;
use std::io::Read;
use std::path::PathBuf;
use std::sync::mpsc;
use std::sync::Arc;
use std::sync::Mutex;
use std::thread::sleep;
use std::time::Duration;
use tauri::EventLoopMessage;
use tauri::Manager;
use tauri::Wry;
use tauri_plugin_store::with_store;
use tauri_plugin_store::Store;
use tauri_plugin_store::StoreCollection;

use crate::events::input_registry::input_registry::InputRegistry;
use crate::events::output_registry::OutputRegistry;
use crate::events::wasm_registry::WASMRegistry;
use crate::sim_utils::input_converters::convert_dec_to_dcb;
use crate::simconnect_mod::wasm::register_wasm_event;
use connector_types::types::input::Input;
use connector_types::types::output::Output;
use connector_types::types::run_bundle::RunBundle;

use super::output_formatter::parse_output_based_on_type;
use super::wasm;
use super::wasm::send_wasm_command;
use crate::sim_utils;

const MAX_RETURNED_ITEMS: usize = 255;

lazy_static! {
    static ref SENDER: Arc<Mutex<Option<mpsc::Sender<u16>>>> = Arc::new(Mutex::new(None));
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct Connections {
    name: String,
    connected: bool,
    id: i32,
}

#[derive(Clone)]
struct Event {
    id: DWORD,
    description: &'static str,
}

#[repr(C, packed)]
struct DataStruct {
    id: DWORD,
    value: f64,
}

#[repr(C, packed)]
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
    pub(crate) wasm_registry: WASMRegistry,
    pub(crate) app_handle: tauri::AppHandle,
    pub(crate) rx: mpsc::Receiver<u16>,
    active_com_ports: HashMap<String, Box<dyn SerialPort>>,
    run_bundles: Vec<RunBundle>,
    connector_settings: ConnectorSettings,
}

// define the payload struct
#[derive(Clone, serde::Serialize)]
struct Payload {
    message: String,
}

impl SimconnectHandler {
    pub fn new(app_handle: tauri::AppHandle, rx: mpsc::Receiver<u16>) -> Self {
        let mut simconnect = simconnect::SimConnector::new();
        simconnect.connect("Tauri Simconnect");
        let input_registry = InputRegistry::new();
        let output_registry = OutputRegistry::new();
        let wasm_registry = WASMRegistry::new();
        let connector_settings = ConnectorSettings { use_trs: false };

        Self {
            simconnect,
            input_registry,
            output_registry,
            wasm_registry,
            app_handle,
            rx,
            active_com_ports: HashMap::new(),
            run_bundles: vec![],
            connector_settings,
        }
    }

    fn parse_com_port(com_port: &str) -> String {
        let parts: Vec<&str> = com_port.split(',').collect();
        match parts.first() {
            Some(x) => x.to_string(),
            None => "".to_string(),
        }
    }

    fn load_connector_settings(&mut self) {
        let stores = self.app_handle.app_handle().state::<StoreCollection<Wry>>();
        let path = PathBuf::from(".connectorSettings.dat");

        let handle_store = |store: &mut Store<Wry>| {
            if let Some(settings) = store.get("connectorSettings") {
                self.connector_settings = serde_json::from_value(settings.clone()).unwrap();
            }
            Ok(())
        };

        match with_store(
            self.app_handle.app_handle().clone(),
            stores,
            path,
            handle_store,
        ) {
            Ok(_) => {}
            Err(e) => {
                error!("Failed to load connector settings: {:?}", e);
            }
        }
    }

    fn set_com_ports(&mut self) {
        for run_bundle in &mut self.run_bundles {
            let parsed_com_port = Self::parse_com_port(&run_bundle.com_port);
            run_bundle.com_port = parsed_com_port;
        }
    }

    fn connect_to_devices(&mut self) {
        let mut connected_ports: Vec<Connections> = vec![];

        for run_bundle in self.run_bundles.iter() {
            let com_port = run_bundle.com_port.clone();

            match serialport::new(com_port.clone(), 115200).open() {
                Ok(mut port) => {
                    if self.connector_settings.use_trs {
                        match port.write_data_terminal_ready(true) {
                            Ok(_) => {
                                println!("Data terminal ready sent")
                            }
                            Err(e) => {
                                println!("Failed to send data terminal ready: {}", e)
                            }
                        };
                        std::thread::sleep(Duration::from_millis(300));
                        match port.write_data_terminal_ready(false) {
                            Ok(_) => {
                                println!("Data terminal ready sent")
                            }
                            Err(e) => {
                                println!("Failed to send data terminal ready: {}", e)
                            }
                        };
                    }
                    std::thread::sleep(Duration::from_millis(400));
                    self.active_com_ports.insert(com_port.clone(), port);
                    info!(target: "connections", "Connected to port: {}", com_port);
                    connected_ports.push(Connections {
                        name: com_port,
                        connected: true,
                        id: run_bundle.id,
                    });
                }
                Err(e) => {
                    error!(target: "connections", "Failed to open port: {}", e);
                    println!("Failed to open port: {}", e);
                }
            };
        }

        for connected_port in connected_ports.iter() {
            self.emit_connections(connected_port.to_owned());
        }
    }

    fn emit_connections(&mut self, conn: Connections) {
        println!("Emitting connection event");
        self.app_handle.emit("connection_event", conn).unwrap();
    }

    pub fn start_connection(&mut self, run_bundles: Vec<RunBundle>) {
        self.run_bundles = run_bundles;
        self.load_connector_settings();
        self.set_com_ports();
        self.connect_to_devices();
        self.initialize_connection();
        self.initialize_simconnect();
        self.main_event_loop();
    }

    fn send_input_to_simconnect(&mut self, command: DWORD, val: DWORD) {
        let input = match self.input_registry.get_input(command) {
            Some(input) => input,
            None => {
                error!(target: "input", "send to wasm,: {}", command);
                wasm::send_wasm_data(&mut self.simconnect, command);
                return;
            }
        };
        let value: DWORD = match input.input_type {
            InputType::SetValueBool => {
                if val == 0 {
                    0
                } else {
                    1
                }
            }
            InputType::SetValueCom => convert_dec_to_dcb(val),
            InputType::SetValue => val,
            InputType::Trigger => 0,
        };
        println!("Sending input to simconnect: {}, {}", command, value);
        self.simconnect.transmit_client_event(
            0,
            command,
            value,
            simconnect::SIMCONNECT_GROUP_PRIORITY_HIGHEST,
            simconnect::SIMCONNECT_EVENT_FLAG_GROUPID_IS_PRIORITY,
        );
    }

    pub fn check_if_output_in_bundle(&mut self, output_id: u32, value: f64) {
        println!("Checking if output in bundle {}, {}", output_id, value);
        let output_registry = self.output_registry.clone();
        let output = match output_registry.get_output_by_id(output_id) {
            Some(output) => output,
            None => return,
        };
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
            self.send_output_to_device(output, &com_port, value);
        }
    }

    fn send_output_to_device(&mut self, output: &Output, com_port: &str, value: f64) {
        let formatted_str = format!(
            "{} {}\n",
            output.id,
            parse_output_based_on_type(value, output)
        );

        match self.active_com_ports.get_mut(com_port) {
            Some(port) => match port.write_all(formatted_str.as_bytes()) {
                Ok(_) => {
                    info!(target: "output", "Output {} sent to port: {}", formatted_str, com_port);
                }
                Err(e) => {
                    error!(target: "output", "Failed to write to port: {}", e);
                }
            },
            None => {
                error!(target: "output", "Port not connected: {}", com_port);
            }
        }
    }

    fn poll_microcontroller_for_inputs(&mut self) {
        let mut messages: Vec<String> = Vec::new();
        for active_com_port in &mut self.active_com_ports {
            let mut buffer: Vec<u8> = Vec::new();
            let mut byte = [0u8; 1];
            let mut reading = true;
            match active_com_port.1.bytes_to_read() {
                Ok(result) => {
                    if result == 0 {
                        continue;
                    }
                    while reading {
                        match active_com_port.1.read(&mut byte) {
                            Ok(bytes_read) => {
                                (0..bytes_read).for_each(|i| {
                                    if byte[i] == b'\n' {
                                        let message = String::from_utf8_lossy(&buffer);
                                        messages.push(message.to_string());
                                        buffer.clear();
                                        //set buffer to \n
                                        buffer.push(byte[i]);
                                        reading = false;
                                    } else if byte[i] != b'\r' {
                                        buffer.push(byte[i]);
                                    }
                                });
                            }
                            Err(e) => eprintln!("{:?}", e),
                        }
                    }
                }
                Err(e) => eprintln!("{:?}", e),
            }
        }
        for message in &messages {
            if message.chars().count() > 4 {
                let id = match message[0..4].trim().parse::<DWORD>() {
                    Ok(id) => id,
                    Err(e) => {
                        eprintln!("{:?}", e);
                        continue;
                    }
                };
                let value = match message[5..].trim().parse::<DWORD>() {
                    Ok(value) => value,
                    Err(e) => {
                        eprintln!("{:?}", e);
                        continue;
                    }
                };
                println!("Message: {}, Value: {}", id, value);

                self.send_input_to_simconnect(id, value);
                continue;
            }
            //parse message to u32 and send to simconnect
            match message.trim().parse::<DWORD>() {
                Ok(dword) => {
                    self.send_input_to_simconnect(dword, 0);
                }
                Err(e) => eprintln!("{:?}", e),
            }
        }
    }

    fn main_event_loop(&mut self) {
        let mut connection_running = true;
        while connection_running {
            match self.rx.try_recv() {
                Ok(r) => {
                    if r == 9999 {
                        connection_running = false;
                        break;
                    }
                }
                Err(mpsc::TryRecvError::Empty) => (),
                Err(mpsc::TryRecvError::Disconnected) => {
                    println!("Disconnected");
                    break;
                }
            }
            self.poll_microcontroller_for_inputs();
            match &mut self.simconnect.get_next_message() {
                Ok(simconnect::DispatchResult::SimObjectData(data)) => {
                    println!("Processing sim object data");
                    match data.dwDefineID {
                        RequestModes::FLOAT => {
                            unsafe {
                                println!("Received float data");
                                let sim_data_ptr =
                                    std::ptr::addr_of!(data.dwData) as *const DataStructContainer;
                                let sim_data_value = std::ptr::read_unaligned(sim_data_ptr);
                                let count = data.dwDefineCount as usize;
                                // itterate through the array of data structs
                                for i in 0..count {
                                    let value = sim_data_value.data[i].value;
                                    let prefix = sim_data_value.data[i].id;
                                    self.check_if_output_in_bundle(prefix, value);
                                }
                            }
                        }
                        RequestModes::STRING => {
                            unsafe {
                                let sim_data_ptr =
                                    std::ptr::addr_of!(data.dwData) as *const StringStruct;
                                // The amount of strings received from the sim
                                let count = data.dwDefineCount as isize;
                                for i in 0..count {
                                    let item_ptr = sim_data_ptr.offset(i);
                                    let sim_data_value = std::ptr::read_unaligned(item_ptr);
                                    let string =
                                        std::str::from_utf8(&sim_data_value.value).unwrap();
                                    println!("{}", string);
                                }
                            }
                        }
                        _ => (),
                    }
                }
                Ok(simconnect::DispatchResult::ClientData(data)) => {
                    let sim_data_ptr = std::ptr::addr_of!(data._base.dwData) as *const f64;
                    unsafe {
                        let sim_data_value = std::ptr::read_unaligned(sim_data_ptr);
                        let output_id = data._base.dwDefineID;
                        let output_value = sim_data_value;
                        self.check_if_output_in_bundle(output_id, output_value);
                    }
                }
                Ok(simconnect::DispatchResult::Event(data)) => {
                    let sim_data_ptr = std::ptr::addr_of!(data.dwData) as *const f64;
                    unsafe {
                        let sim_data_value = std::ptr::read_unaligned(sim_data_ptr);
                        // TODO send to microcontroller
                        let output_id = data.uEventID;
                        let output_value = sim_data_value;
                        self.check_if_output_in_bundle(output_id, output_value);
                    }
                }
                _ => (),
            }
            sleep(Duration::from_millis(1));
        }
    }

    pub fn initialize_connection(&mut self) {
        self.simconnect.connect("Bits and Droids connector");
        self.input_registry.load_inputs();
        self.wasm_registry.load_wasm();
        self.output_registry.load_outputs();
        wasm::register_wasm_data(&mut self.simconnect);
        self.define_outputs();
        self.define_inputs();
        self.define_wasm_outputs();
    }

    fn initialize_simconnect(&mut self) {
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
    }

    pub fn define_inputs(&mut self) {
        let inputs = self.input_registry.get_inputs();
        for input in inputs {
            self.simconnect.map_client_event_to_sim_event(
                *input.0 as SIMCONNECT_CLIENT_EVENT_ID,
                input.1.event.as_str(),
            );
        }
        let wasm_inputs = self.wasm_registry.get_wasm_inputs();
        println!("Wasm inputs: {:?}", wasm_inputs);
        for wasm_input in wasm_inputs {
            let wasm_event = WasmEvent {
                id: wasm_input.id,
                action: wasm_input.action.to_string(),
                action_text: "".to_string(),
                action_type: "input".to_string(),
                output_format: "".to_string(),
                update_every: 0.0,
                value: 0.0,
                min: 0.0,
                max: 0.0,
                offset: 0,
            };
            register_wasm_event(&mut self.simconnect, wasm_event);
        }
    }

    pub fn define_wasm_outputs(&self) {
        //
    }

    pub fn define_outputs(&mut self) {
        let wasm_registry = &self.wasm_registry;

        let run_bundles = &self.run_bundles;
        let mut outputs_not_found = vec![];
        for run_bundle in run_bundles {
            for output in &run_bundle.bundle.outputs {
                match self.output_registry.get_output_by_id(output.id) {
                    Some(latest_output) => {
                        println!("Output found: {:?} {}", output.id, output.simvar);
                        self.simconnect.add_data_definition(
                            RequestModes::FLOAT,
                            &latest_output.simvar,
                            &latest_output.metric,
                            simconnect::SIMCONNECT_DATATYPE_SIMCONNECT_DATATYPE_FLOAT64,
                            latest_output.id,
                            latest_output.update_every,
                        );
                    }
                    None => {
                        outputs_not_found.push(output);
                        println!("Output not found: {:?}", output);
                    }
                }
            }
        }
        self.simconnect
            .add_to_client_data_definition(106, 0, 4096, 0.0, 0);
        send_wasm_command(&mut self.simconnect, "clear");
        let mut items = 0;
        outputs_not_found.into_iter().for_each(|output| {
            // match wasm_registry.get_wasm_output_by_id(output.id) {
            //     Some(wasm_output) => {
            println!("ADD WASM: {:?}", output);

            let wasm_event = WasmEvent {
                id: output.id,
                action: output.simvar.to_string(),
                action_text: "".to_string(),
                action_type: "output".to_string(),
                output_format: "".to_string(),
                update_every: output.update_every,
                value: 0.0,
                min: 0.0,
                max: 0.0,
                offset: (std::mem::size_of::<f64>() * items) as u32,
            };
            register_wasm_event(&mut self.simconnect, wasm_event);
            self.simconnect.add_to_client_data_definition(
                output.id,
                (std::mem::size_of::<f64>() * items) as u32,
                std::mem::size_of::<f64>() as u32,
                output.update_every,
                0,
            );
            self.simconnect.request_client_data(
                2,
                output.id,
                output.id,
                simconnect::SIMCONNECT_CLIENT_DATA_PERIOD_SIMCONNECT_CLIENT_DATA_PERIOD_ON_SET,
                simconnect::SIMCONNECT_CLIENT_DATA_REQUEST_FLAG_CHANGED,
                0,
                0,
                0,
            );

            items += 1;
        });
    }
}
