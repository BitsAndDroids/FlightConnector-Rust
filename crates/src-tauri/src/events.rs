use crate::events;
use connector_types::types::wasm_event::WasmEvent;

pub mod bundle_registry;
pub mod input_registry;
pub mod output_registry;
pub mod wasm_registry;

#[tauri::command]
pub async fn get_wasm_events(app: tauri::AppHandle) -> Vec<WasmEvent> {
    let mut wasm_registry = events::wasm_registry::WASMRegistry::new();
    wasm_registry.load_wasm(app);
    let events = wasm_registry.get_wasm_events();
    events
}
