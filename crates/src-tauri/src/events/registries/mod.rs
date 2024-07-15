mod action_registry;
mod input_registry;
mod output_registry;
mod wasm_registry;

pub use action_registry::ActionRegistry;
use connector_types::types::WasmEvent;
pub use input_registry::InputRegistry;
pub use output_registry::OutputRegistry;
pub use wasm_registry::WASMRegistry;

#[tauri::command]
pub async fn get_wasm_events(app: tauri::AppHandle) -> Vec<WasmEvent> {
    let mut wasm_registry = WASMRegistry::new();
    wasm_registry.load_wasm(app);
    wasm_registry.get_wasm_events()
}
