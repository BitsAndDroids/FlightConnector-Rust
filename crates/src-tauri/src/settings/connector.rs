use std::path::PathBuf;

use connector_types::types::{ConnectorSettings, SavedConnectorSettings};
use log::error;
use tauri::{AppHandle, Manager, Wry};
use tauri_plugin_store::{with_store, Store, StoreCollection};

pub fn get_connector_settings(app: &AppHandle) -> ConnectorSettings {
    let stores = app.state::<StoreCollection<Wry>>();
    let path = PathBuf::from(".connectorSettings.dat");
    let mut saved_settings: Option<SavedConnectorSettings> = None;

    let handle_store = |store: &mut Store<Wry>| {
        if let Some(settings) = store.get("connectorSettings") {
            saved_settings = Some(serde_json::from_value(settings.clone()).unwrap());
        }
        Ok(())
    };

    match with_store(app.clone(), stores, path, handle_store) {
        Ok(_) => {}
        Err(e) => {
            error!("Failed to load connector settings: {:?}", e);
        }
    }
    //if saved settings exist, set the default settings
    saved_settings.unwrap_or_default().into()
}
