use connector_types::types::connector_settings::ConnectorSettings;
use connector_types::types::input::InputType;
use connector_types::types::simvar_update::SimvarUpdate;
use lazy_static::lazy_static;
use log::warn;
use log::{error, info};
use serde::Deserialize;
use serde::Serialize;
use serial::serial::serial_device::{Serial, SerialDevice};
use simconnect::DWORD;
use std::collections::HashMap;
use std::sync::mpsc;
use std::sync::Arc;
use std::sync::Mutex;
use std::thread::sleep;
use std::time::Duration;
use tauri::Emitter;

use crate::events::action_registry::ActionRegistry;
use crate::events::input_registry::InputRegistry;
use crate::events::output_registry::OutputRegistry;
use crate::events::wasm_registry::WASMRegistry;
use crate::settings::connector_settings::load_connector_settings;
use crate::sim_utils::input_converters::convert_dec_to_dcb;
use crate::simconnect_mod::wasm::register_wasm_event;
use crate::Message;
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
    pub(crate) rx: mpsc::Receiver<Message>,
    active_com_ports: HashMap<String, Box<dyn Serial>>,
    run_bundles: Vec<RunBundle>,
    connector_settings: ConnectorSettings,
}

impl SimconnectHandler {
    pub fn new(app_handle: tauri::AppHandle, rx: mpsc::Receiver<Message>) -> Self {
        let mut simconnect = simconnect::SimConnector::new();
        simconnect.connect("Tauri Simconnect");
        let input_registry = InputRegistry::new();
        let output_registry = OutputRegistry::new();
        let action_registry = ActionRegistry::new();
        let wasm_registry = WASMRegistry::new();
        let connector_settings = ConnectorSettings::get_default_settings();

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

    fn set_settings(&mut self) {
        self.connector_settings =
            ConnectorSettings::from(load_connector_settings(&self.app_handle));
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
            match SerialDevice::new(run_bundle.com_port.clone(), self.connector_settings.use_trs) {
                Ok(serial) => {
                    info!(target: "connections", "Connected to port: {}", run_bundle.com_port);
                    connected_ports.push(Connections {
                        name: serial.get_name(),
                        connected: true,
                        id: run_bundle.id,
                    });
                    self.active_com_ports
                        .insert(run_bundle.com_port.clone(), Box::new(serial));
                }
                Err(e) => {
                    error!(target: "connections", "Failed to open port: {}", e);
                }
            };
        }

        for connected_port in connected_ports.iter() {
            self.emit_connections(connected_port.to_owned());
        }
        //Allow time for the controllers to boot after a connection reset
        sleep(Duration::from_millis(2000));

        for port in self.active_com_ports.values_mut() {
            port.send_connected_signal(true);
        }
    }

    fn emit_connections(&mut self, conn: Connections) {
        self.app_handle.emit("connection_event", conn).unwrap();
    }

    pub fn start_connection(&mut self, run_bundles: Vec<RunBundle>) {
        self.run_bundles = run_bundles;
        println!(
            "Starting connection with run bundles: {:?}",
            self.run_bundles
        );
        self.set_settings();
        self.set_com_ports();
        self.connect_to_devices();
        self.initialize_connection();
        self.initialize_simconnect();
        self.main_event_loop();
    }

    fn send_input_to_simconnect(&mut self, command: DWORD, val: i32, raw: String) {
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
            value as DWORD,
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
            .unwrap_or((false, output_id));

        if !output_exists.0 {
            error!("Output does not exist: {}", output_id);
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

        self.app_handle
            .emit(
                "simvar_update",
                SimvarUpdate {
                    id: output_id,
                    value,
                },
            )
            .expect("Something went wrong emitting value");
        for com_port in com_ports {
            self.send_output_to_device(output_exists.1, &com_port, value);
        }
    }

    fn send_output_to_device(&mut self, output_id: u32, com_port: &str, value: f64) {
        println!(
            "Sending output to device: {}, {}, {}",
            output_id, com_port, value
        );
        self.app_handle
            .emit_to(
                "logWindow",
                "simvar_update",
                SimvarUpdate {
                    id: output_id,
                    value,
                },
            )
            .expect("Something went wrong emitting value");

        // Mutably borrow self.output_registry to set the value
        // TODO: refactor to return result instead
        self.output_registry.set_output_value(output_id, value);

        // After setting the value, we only need immutable access to output_registry
        let output = match self.output_registry.get_output_by_id(output_id) {
            Some(output) => output,
            None => {
                error!("Output does not exist: {}", output_id);
                return;
            }
        };

        // Format the output string
        let formatted_str = format!(
            "{} {}\n",
            output.id,
            parse_output_based_on_type(value, output)
        );
        // Mutably borrow self.active_com_ports to send data
        match self.active_com_ports.get_mut(com_port) {
            Some(port) => {
                info!(target: "output", "{} --> {}", port.get_name(), formatted_str);
                port.write(formatted_str.as_bytes())
            }
            None => {
                error!(target: "output", "Port not connected: {}", com_port);
            }
        }
        sleep(Duration::from_millis(self.connector_settings.send_every_ms));
    }

    fn send_last_output_value_to_controller(&mut self, output_id: i32) {
        if output_id == 1 {
            for port in self.active_com_ports.values_mut() {
                port.send_connected_signal(true)
            }
        }
        let output_value = {
            let output = match self.output_registry.get_output_by_id(output_id as u32) {
                Some(output) => output,
                None => {
                    warn!(target: "output", "Output does not exist: {}", output_id);
                    return;
                }
            };
            output.value
        };
        info!(target: "output",
            "Sending last output value to controller: {}, {}",
            output_id, output_value
        );
        self.check_if_output_in_bundle(output_id as u32, output_value);
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
                    .parse::<i32>()
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
                        .parse::<i32>()
                        .unwrap_or(0);
                }
                if id == 999 {
                    self.send_last_output_value_to_controller(value);
                    return;
                }
                self.send_input_to_simconnect(id as u32, value, message.to_string());
            }
        }
    }

    fn main_event_loop(&mut self) {
        loop {
            match self.rx.try_recv() {
                Ok(r) => {
                    if r.id == 0 && r.value == 9999 {
                        for port in self.active_com_ports.values_mut() {
                            port.send_connected_signal(false);
                        }
                        break;
                    }
                    self.send_input_to_simconnect(r.id, r.value, "".to_string());
                }
                Err(mpsc::TryRecvError::Empty) => (),
                Err(mpsc::TryRecvError::Disconnected) => {
                    info!("Disconnected");
                    for port in self.active_com_ports.values_mut() {
                        info!("{} Sending connected signal: false", port.get_name());
                        port.send_connected_signal(false);
                    }
                    break;
                }
            }
            self.poll_microcontroller_for_inputs();
            match &mut self.simconnect.get_next_message() {
                Ok(simconnect::DispatchResult::SimObjectData(data)) => {
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
                                    // TODO: Add to an event triggered on plane swap as well
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
                                    // TODO: HANDLE STRING DATA
                                    let _string =
                                        std::str::from_utf8(&sim_data_value.value).unwrap();
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
        self.wasm_registry.load_wasm(&self.app_handle);
        self.output_registry.load_outputs();
        let wasm_outputs = self.wasm_registry.get_wasm_outputs();
        self.output_registry.add_wasm_outputs(wasm_outputs);
        wasm::register_wasm_data(&mut self.simconnect);
        self.define_outputs();
        self.define_inputs();
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
        self.input_registry
            .register_inputs_to_simconnect(&mut self.simconnect);

        self.wasm_registry
            .register_wasm_inputs_to_simconnect(&mut self.simconnect);
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

        self.simconnect
            .add_to_client_data_definition(106, 0, 4096, 0.0, 0);
        send_wasm_command(&mut self.simconnect, "clear");
        for run_bundle in run_bundles {
            for output in &run_bundle.bundle.outputs {
                match self.output_registry.get_output_by_id(output.id) {
                    Some(latest_output) => {
                        println!("Output found: {:?} {}", output.id, output.simvar);
                        if latest_output.custom {
                            let wasm_event =
                                match self.wasm_registry.get_wasm_event_by_id(output.id) {
                                    Some(wasm_event) => wasm_event.clone(),
                                    None => {
                                        warn!("Wasm output not found: {:?}", output);
                                        return;
                                    }
                                };

                            self.simconnect.add_to_client_data_definition(
                                wasm_event.id,
                                wasm_event.offset,
                                std::mem::size_of::<f64>() as u32,
                                wasm_event.update_every,
                                0,
                            );
                            register_wasm_event(&mut self.simconnect, wasm_event.clone());
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
                        }
                        if !latest_output.custom {
                            self.simconnect.add_data_definition(
                                RequestModes::FLOAT,
                                &latest_output.simvar,
                                &latest_output.metric,
                                simconnect::SIMCONNECT_DATATYPE_SIMCONNECT_DATATYPE_FLOAT64,
                                latest_output.id,
                                output.update_every,
                            );
                        }
                    }
                    None => {
                        outputs_not_found.push(output);
                        println!("Output not found: {:?}", output);
                    }
                }
            }
        }
    }
}
