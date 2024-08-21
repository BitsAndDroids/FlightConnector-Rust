use std::{collections::HashMap, path::PathBuf};

use connector_types::types::{output::Output, output_format::FormatOutput, wasm_event::WasmEvent};
use log::error;
use serde_json::json;
use tauri::{Manager, Wry};
use tauri_plugin_store::{with_store, Store, StoreCollection};

use crate::simconnect_mod::wasm::send_wasm_command;
#[derive(Debug, Clone)]
pub struct WASMRegistry {
    wasm_outputs: HashMap<u32, WasmEvent>,
    wasm_inputs: HashMap<u32, WasmEvent>,
    parsed_wasm_outputs: HashMap<u32, Output>,
    wasm_default_events: Vec<WasmEvent>,
    wasm_file_path: String,
}

impl WASMRegistry {
    pub fn new() -> WASMRegistry {
        WASMRegistry {
            wasm_outputs: HashMap::new(),
            parsed_wasm_outputs: HashMap::new(),
            wasm_inputs: HashMap::new(),
            wasm_default_events: Vec::new(),
            wasm_file_path: String::from("wasm_module/modules/wasm_events.json"),
        }
    }

    pub fn load_default_events(&mut self) {
        let wasm_events =
            file_parsers::parsers::wasm_event_parser::parse_events_from_file(&self.wasm_file_path);
        self.wasm_default_events = wasm_events;
        println!("Default event count: {}", self.wasm_default_events.len());
    }

    pub fn update_defauts_to_store(&mut self, app: tauri::AppHandle) {
        let stores = app.app_handle().state::<StoreCollection<Wry>>();
        let path = PathBuf::from(".events.dat");
        let handle_store = |store: &mut Store<Wry>| {
            for event in &self.wasm_default_events {
                match store.insert(event.id.to_string().clone(), json!(event)) {
                    Ok(_) => {}
                    Err(e) => {
                        error!("Failed to insert default event: {:?}", e);
                    }
                }
            }
            match store.save() {
                Ok(_) => {}
                Err(e) => {
                    error!("Failed to save default events: {:?}", e);
                }
            }
            Ok(())
        };
        match with_store(app.app_handle().clone(), stores, path, handle_store) {
            Ok(_) => {}
            Err(e) => {
                error!("Failed to load connector settings: {:?}", e);
            }
        }

        self.load_wasm(app);
    }

    pub fn load_wasm(&mut self, app: tauri::AppHandle) {
        let stores = app.app_handle().state::<StoreCollection<Wry>>();
        let path = PathBuf::from(".events.dat");
        let mut output_counter = 0;
        let handle_store = |store: &mut Store<Wry>| {
            let keys = store.keys();
            for key in keys {
                let value = store.get(key).unwrap();
                let mut wasm_event: WasmEvent = serde_json::from_value(value.clone()).unwrap();
                wasm_event.offset = output_counter * 8;
                if wasm_event.action_type == "output" {
                    self.wasm_outputs.insert(wasm_event.id, wasm_event.clone());
                    self.parsed_wasm_outputs
                        .insert(wasm_event.id, wasm_event.into());
                    output_counter += 1;
                } else {
                    self.wasm_inputs.insert(wasm_event.id, wasm_event);
                }
            }
            Ok(())
        };

        match with_store(app.app_handle().clone(), stores, path, handle_store) {
            Ok(_) => {}
            Err(e) => {
                error!("Failed to load connector settings: {:?}", e);
            }
        }
    }

    pub fn get_wasm_output_by_id(&mut self, output_id: u32) -> Option<&Output> {
        self.parsed_wasm_outputs.get(&output_id)
    }

    pub fn get_wasm_event_by_id(&self, event_id: u32) -> Option<&WasmEvent> {
        self.wasm_outputs.get(&event_id)
    }

    pub fn get_wasm_outputs(&self) -> &HashMap<u32, WasmEvent> {
        &self.wasm_outputs
    }

    pub fn get_wasm_inputs(&self) -> &HashMap<u32, WasmEvent> {
        &self.wasm_inputs
    }

    pub fn get_wasm_events(&self) -> HashMap<u32, WasmEvent> {
        let mut events = self.wasm_outputs.clone();
        events.extend(self.wasm_inputs.clone());
        events
    }

    pub fn get_default_wasm_events(&self) -> Vec<WasmEvent> {
        self.wasm_default_events.clone()
    }

    pub fn register_wasm_inputs_to_simconnect(&self, conn: &mut simconnect::SimConnector) {
        for wasm_input in self.wasm_inputs.values() {
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

            let event_json = serde_json::to_string(&wasm_event).unwrap();
            send_wasm_command(conn, event_json.as_str());
        }
    }
}
