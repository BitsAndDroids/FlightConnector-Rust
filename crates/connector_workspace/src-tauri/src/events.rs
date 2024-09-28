use crate::events;
use connector_types::types::wasm_event::WasmEvent;

pub mod action;
pub mod action_registry;
pub mod actions;
pub mod input_registry;
pub mod output_registry;
pub mod wasm_registry;

#[tauri::command]
pub async fn get_wasm_events(app: tauri::AppHandle) -> Vec<WasmEvent> {
    let mut wasm_registry = events::wasm_registry::WASMRegistry::new();
    wasm_registry.load_wasm(app);
    let wasm_events = wasm_registry.get_wasm_events();
    let mut wasm_event_vec: Vec<WasmEvent> = Vec::new();
    for (_, wasm_event) in wasm_events {
        wasm_event_vec.push(wasm_event.clone());
    }
    wasm_event_vec
}
