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
    // let stores = app_handle.state::<StoreCollection<Wry>>();
    // let path = PathBuf::from(".connectorSettings.dat");
    // let mut saved_settings: Option<SavedConnectorSettings> = None;
    //
    // let handle_store = |store: &mut Store<Wry>| {
    //     if let Some(settings) = store.get("connectorSettings") {
    //         saved_settings = Some(serde_json::from_value(settings.clone()).unwrap());
    //     }
    //     Ok(())
    // };
    //
    // match with_store(app_handle.clone(), stores, path, handle_store) {
    //     Ok(_) => {}
    //     Err(e) => {
    //         error!("Failed to load connector settings: {:?}", e);
    //     }
    // }
    // //if saved settings exist, set the default settings
    // if let Some(settings) = saved_settings {
    //     settings
    // } else {
    //     SavedConnectorSettings {
    //         use_trs: None,
    //         adc_resolution: None,
    //         installed_wasm_version: None,
    //         send_every_ms: None,
    //     }
    // }
}
