use std::sync::Arc;

use tauri::Wry;

pub fn save_store(store: Arc<tauri_plugin_store::Store<Wry>>) {
    match store.save() {
        Ok(_) => {
            println!("Store saved");
        }
        Err(e) => {
            println!("Failed to save store: {:?}", e);
        }
    }
}
