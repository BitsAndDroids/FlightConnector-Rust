use connector_types::types::connector_settings::SavedConnectorSettings;
use log::error;
use tauri_plugin_store::StoreExt;

pub fn load_connector_settings(app_handle: &tauri::AppHandle) -> SavedConnectorSettings {
    let store = app_handle.store(".connectorSettings.dat").unwrap();
    let settings = store.get("connectorSettings");
    match settings {
        Some(settings) => serde_json::from_value(settings.clone()).unwrap(),
        None => {
            error!("Failed to load connector settings");
            SavedConnectorSettings {
                use_trs: None,
                adc_resolution: None,
                installed_wasm_version: None,
                send_every_ms: None,
            }
        }
    }
}
