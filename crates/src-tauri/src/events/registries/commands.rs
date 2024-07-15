use connector_types::types::WasmEvent;

use super::WASMRegistry;

#[tauri::command]
pub async fn get_wasm_events(app: tauri::AppHandle) -> Vec<WasmEvent> {
    let mut wasm_registry = WASMRegistry::new();
    wasm_registry.load_wasm(app);
    wasm_registry.get_wasm_events()
}
