use connector_types::types::connector_settings::ConnectorSettings;
use connector_types::types::connector_settings::SavedConnectorSettings;
use connector_types::types::input::InputType;
use connector_types::types::wasm_event::WasmEvent;
use lazy_static::lazy_static;
use log::{error, info};
use serde::Deserialize;
use serde::Serialize;
use simconnect::DWORD;
use simconnect::SIMCONNECT_CLIENT_EVENT_ID;
use std::collections::HashMap;
use std::path::PathBuf;
use std::sync::mpsc;
use std::sync::Arc;
use std::sync::Mutex;
use std::thread::sleep;
use std::time::Duration;
use tauri::Manager;
use tauri::Wry;
use tauri_plugin_store::with_store;
use tauri_plugin_store::Store;
use tauri_plugin_store::StoreCollection;

use crate::events::action_registry::ActionRegistry;
use crate::events::input_registry::input_registry::InputRegistry;
use crate::events::output_registry::OutputRegistry;
use crate::events::wasm_registry::WASMRegistry;
use crate::serial::serial::Commands;
use crate::serial::serial::Serial;
use crate::sim_utils::input_converters::convert_dec_to_dcb;
use crate::simconnect_mod::wasm::register_wasm_event;
use connector_types::types::run_bundle::RunBundle;

use super::output_formatter::parse_output_based_on_type;
use super::wasm;
use super::wasm::send_wasm_command;

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
    _float: DWORD,
    _string: DWORD,
}

impl RequestModes {
    const FLOAT: DWORD = 0;
    const STRING: DWORD = 1;
}

pub struct SimconnectHandler {
    pub(crate) simconnect: simconnect::SimConnector,
    pub(crate) input_registry: InputRegistry,
    pub(crate) action_registry: ActionRegistry,
    pub(crate) output_registry: OutputRegistry,
    pub(crate) wasm_registry: WASMRegistry,
    pub(crate) app_handle: tauri::AppHandle,
    pub(crate) rx: mpsc::Receiver<u16>,
    active_com_ports: HashMap<String, Serial>,
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
        let action_registry = ActionRegistry::new();
        let wasm_registry = WASMRegistry::new();
        let connector_settings = ConnectorSettings {
            use_trs: true,
            adc_resolution: 1023,
            installed_wasm_version: "0.0.0".to_owned(),
        };

        Self {
            simconnect,
            input_registry,
            output_registry,
            action_registry,
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

    fn set_settings(&mut self, saved_settings: SavedConnectorSettings) {
        match saved_settings.use_trs {
            Some(_) => {
                self.connector_settings.use_trs = saved_settings.use_trs.unwrap();
            }
            None => {
                self.connector_settings.use_trs = false;
            }
        }
        match saved_settings.adc_resolution {
            Some(_) => {
                self.connector_settings.adc_resolution = saved_settings.adc_resolution.unwrap();
            }
            None => {
                self.connector_settings.adc_resolution = 1023;
            }
        }
        match saved_settings.installed_wasm_version {
            Some(_) => {
                self.connector_settings.installed_wasm_version =
                    saved_settings.installed_wasm_version.unwrap();
            }
            None => {
                self.connector_settings.installed_wasm_version = "0.0.0".to_owned();
            }
        }
    }

    fn load_connector_settings(&mut self) {
        let stores = self.app_handle.app_handle().state::<StoreCollection<Wry>>();
        let path = PathBuf::from(".connectorSettings.dat");
        let mut saved_settings: Option<SavedConnectorSettings> = None;

        let handle_store = |store: &mut Store<Wry>| {
            if let Some(settings) = store.get("connectorSettings") {
                saved_settings = Some(serde_json::from_value(settings.clone()).unwrap());
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
        //if saved settings exist, set the default settings
        if let Some(settings) = saved_settings {
            self.set_settings(settings);
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
            match Serial::new(run_bundle.com_port.clone(), self.connector_settings.use_trs) {
                Ok(serial) => {
                    connected_ports.push(Connections {
                        name: serial.get_name(),
                        connected: true,
                        id: run_bundle.id,
                    });
                    self.active_com_ports
                        .insert(run_bundle.com_port.clone(), serial);
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
        //Allow time for the controllers to boot after a connection reset
        sleep(Duration::from_millis(2000));
    }

    fn emit_connections(&mut self, conn: Connections) {
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

    fn send_input_to_simconnect(&mut self, command: DWORD, val: DWORD, raw: String) {
        let input = match self.input_registry.get_input(command) {
            Some(input) => input,
            None => {
                info!(target: "input", "send to wasm,: {}", command);
                wasm::send_wasm_data(&mut self.simconnect, command);
                return;
            }
        };
        info!(target: "input", "Sending input to simconnect: {} id: {} val: {}",input.event,command, val);
        let value;
        match input.input_type {
            InputType::SetValueBool => {
                if val == 0 {
                    value = 0;
                } else {
                    value = 1;
                }
            }
            InputType::SetValueCom => {
                value = convert_dec_to_dcb(val);
            }
            InputType::SetValue => value = val,
            InputType::Trigger => {
                if val == 0 {
                    value = 0;
                } else {
                    value = val;
                }
            }
            InputType::Axis => {
                // TODO: implement axis with calibration logic
                value = val;
            }
            InputType::Action => {
                let action = self.action_registry.get_action_by_id(command).unwrap();
                // After loading the settings we've established that
                action.excecute_action(
                    &self.simconnect,
                    raw,
                    self.action_registry.min_throttle,
                    self.connector_settings.adc_resolution,
                );
                return;
            }
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
        // Check if output exists in outputs or wasm_registry
        let output_exists = self
            .output_registry
            .get_output_by_id(output_id)
            .map(|output| (true, output.id))
            .or_else(|| {
                self.wasm_registry
                    .get_wasm_output_by_id(output_id)
                    .map(|output| (true, output.id))
            })
            .unwrap_or((false, output_id));

        if !output_exists.0 {
            println!("Output does not exist: {}", output_id);
            return;
        }

        let com_ports: Vec<_> = self
            .run_bundles
            .iter()
            .filter_map(|run_bundle| {
                if run_bundle
                    .bundle
                    .outputs
                    .iter()
                    .any(|output| output.id == output_id)
                {
                    Some(run_bundle.com_port.clone())
                } else {
                    None
                }
            })
            .collect();

        for com_port in com_ports {
            self.send_output_to_device(output_exists.1, &com_port, value);
        }
    }

    fn send_output_to_device(&mut self, output_id: u32, com_port: &str, value: f64) {
        println!(
            "Sending output to device: {}, {}, {}",
            output_id, com_port, value
        );

        // Mutably borrow self.output_registry to set the value
        self.output_registry.set_output_value(output_id, value);

        // After setting the value, we only need immutable access to output_registry
        let output = self.output_registry.get_output_by_id(output_id).unwrap();

        // Format the output string
        let formatted_str = format!(
            "{} {}\n",
            output.id,
            parse_output_based_on_type(value, output)
        );

        // Mutably borrow self.active_com_ports to send data
        match self.active_com_ports.get_mut(com_port) {
            Some(port) => match port.write(formatted_str.as_bytes()) {
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

    fn send_last_output_value_to_controller(&mut self, output_id: u32) {
        if output_id == 1 {
            for port in self.active_com_ports.values_mut() {
                port.send_connected_signal(true)
            }
        }
        let output_value = {
            let output = match self.output_registry.get_output_by_id(output_id) {
                Some(output) => output,
                None => {
                    println!("Output does not exist: {}", output_id);
                    return;
                }
            };
            output.value
        };
        info!(target: "output",
            "Sending last output value to controller: {}, {}",
            output_id, output_value
        );
        self.check_if_output_in_bundle(output_id, output_value);
    }

    fn poll_microcontroller_for_inputs(&mut self) {
        let mut messages: Vec<String> = Vec::new();
        for active_com_port in self.active_com_ports.values_mut() {
            if let Some(message) = active_com_port.read_full_message() {
                messages.push(message);
            }
        }
        for message in &messages {
            let count = message.chars().count();
            if count > 1 {
                let id = match message
                    .split_whitespace()
                    .next()
                    .unwrap_or("")
                    .trim()
                    .parse::<DWORD>()
                {
                    Ok(id) => id,
                    Err(_) => {
                        continue;
                    }
                };
                let mut value = 0;
                if count > 4 {
                    let mut message_split = message.split_whitespace();
                    value = message_split
                        .nth(1)
                        .unwrap_or("")
                        .trim()
                        .parse::<DWORD>()
                        .unwrap_or(0);
                }
                if id == 999 {
                    self.send_last_output_value_to_controller(value);
                    return;
                }
                self.send_input_to_simconnect(id, value, message.to_string());
            }
        }
    }

    fn main_event_loop(&mut self) {
        loop {
            match self.rx.try_recv() {
                Ok(r) => {
                    if r == 9999 {
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
                                let sim_data_ptr =
                                    std::ptr::addr_of!(data.dwData) as *const DataStructContainer;
                                let sim_data_value = std::ptr::read_unaligned(sim_data_ptr);
                                let count = data.dwDefineCount as usize;
                                // itterate through the array of data structs
                                for i in 0..count {
                                    let value = sim_data_value.data[i].value;
                                    let prefix = sim_data_value.data[i].id;
                                    // TODO: Move to an event triggered on plane swap
                                    //
                                    //This value is the lower throttle limit
                                    //This is a special case for the throttle since the range
                                    //changes depending on the aircraft
                                    if prefix == 655 {
                                        self.action_registry.set_min_throttle(value as f32);
                                    }
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
        self.wasm_registry.load_wasm(self.app_handle.clone());
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
        for wasm_input in wasm_inputs.values() {
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
                plane_or_category: "".to_string(),
            };
            register_wasm_event(&mut self.simconnect, wasm_event);
        }
    }

    pub fn define_wasm_outputs(&self) {
        //
    }

    pub fn define_outputs(&mut self) {
        let run_bundles = &self.run_bundles;
        let mut outputs_not_found = vec![];
        //we need this event to set the throttle min value
        self.simconnect.add_data_definition(
            RequestModes::FLOAT,
            "THROTTLE LOWER LIMIT",
            "Percentage",
            simconnect::SIMCONNECT_DATATYPE_SIMCONNECT_DATATYPE_FLOAT64,
            655,
            0.0,
        );
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
        outputs_not_found.into_iter().for_each(|output| {
            println!("ADD WASM: {:?}", output);

            let wasm_event = match self.wasm_registry.get_wasm_event_by_id(output.id) {
                Some(wasm_event) => wasm_event.clone(),
                None => {
                    println!("Wasm output not found: {:?}", output);
                    return;
                }
            };

            register_wasm_event(&mut self.simconnect, wasm_event.clone());
            self.simconnect.add_to_client_data_definition(
                wasm_event.id,
                wasm_event.offset,
                std::mem::size_of::<f64>() as u32,
                wasm_event.update_every,
                0,
            );
            self.simconnect.request_client_data(
                2,
                wasm_event.id,
                wasm_event.id,
                simconnect::SIMCONNECT_CLIENT_DATA_PERIOD_SIMCONNECT_CLIENT_DATA_PERIOD_ON_SET,
                simconnect::SIMCONNECT_CLIENT_DATA_REQUEST_FLAG_CHANGED,
                0,
                0,
                0,
            );
        });
    }
}
