use std::path::PathBuf;

use connector_types::types::wasm_event::WasmEvent;
use log::error;
use tauri::{Manager, Wry};
use tauri_plugin_store::{with_store, Store, StoreBuilder, StoreCollection};
#[derive(Debug)]
pub struct WASMRegistry {
    wasm_outputs: Vec<WasmEvent>,
    wasm_inputs: Vec<WasmEvent>,
    wasm_default_events: Vec<WasmEvent>,
    wasm_file_path: String,
}

impl WASMRegistry {
    pub fn new() -> WASMRegistry {
        WASMRegistry {
            wasm_outputs: Vec::new(),
            wasm_inputs: Vec::new(),
            wasm_default_events: Vec::new(),
            wasm_file_path: String::from("wasm_module/modules/wasm_events.json"),
        }
    }

    pub fn load_default_events(&mut self) {
        let wasm_events =
            file_parsers::parsers::wasm_event_parser::parse_events_from_file(&self.wasm_file_path);
        self.wasm_default_events = wasm_events;
        println!("Input event count: {}", self.wasm_inputs.len());
    }

    pub fn load_wasm(&mut self, app: tauri::AppHandle) {
        let stores = app.app_handle().state::<StoreCollection<Wry>>();
        let mut store = StoreBuilder::new(".events.dat").build(app.clone());
        store.save();
        let path = PathBuf::from(".events.dat");

        let handle_store = |store: &mut Store<Wry>| {
            let keys = store.keys();
            for key in keys {
                let value = store.get(&key).unwrap();
                let wasm_event: WasmEvent = serde_json::from_value(value.clone()).unwrap();
                if wasm_event.action_type == "output" {
                    self.wasm_outputs.push(wasm_event);
                } else {
                    self.wasm_inputs.push(wasm_event);
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

    pub fn get_wasm_output_by_id(&self, output_id: u32) -> Option<&WasmEvent> {
        self.wasm_outputs
            .iter()
            .find(|&output| output.id == output_id)
    }

    pub fn get_wasm_outputs(&self) -> &Vec<WasmEvent> {
        &self.wasm_outputs
    }

    pub fn get_wasm_inputs(&self) -> &Vec<WasmEvent> {
        &self.wasm_inputs
    }

    pub fn get_wasm_events(&self) -> Vec<WasmEvent> {
        let mut events = self.wasm_outputs.clone();
        let mut input_events = self.wasm_inputs.clone();
        vec![events, input_events].concat()
    }

    pub fn get_default_wasm_events(&self) -> Vec<WasmEvent> {
        self.wasm_default_events.clone()
    }
}
