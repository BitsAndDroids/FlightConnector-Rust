use log::error;
use serde_json::json;
use tauri_plugin_store::StoreExt;

use super::store::save_store;

#[tauri::command]
pub fn install_wasm(app: tauri::AppHandle) {
    let exe_path = std::env::current_dir().unwrap();
    let wasm_path = exe_path.join("wasm_module");
    let version = get_version_from_manifest();
    let mut community_folder_path: std::path::PathBuf = std::path::PathBuf::from("");

    let store = match app.store(".connectorSettings.dat") {
        Ok(s) => s,
        Err(e) => {
            error!("Failed to open store {}", e);
            return;
        }
    };
    if let Some(v) = store.get("communityFolderPath") {
        community_folder_path = std::path::PathBuf::from(v.as_str().unwrap());
        println!("Community folder path: {:?}", community_folder_path);
        store.set("installedWASMVersion".to_owned(), json!(version))
    }
    save_store(store);

    let files = return_files_in_dir(wasm_path.to_str().unwrap());
    for file in files {
        // check if file contains wasm_event.json and skip it
        if file.path().to_str().unwrap().contains("wasm_events.json") {
            continue;
        }
        let file_path = file.path().clone();
        let relative_path = file_path.strip_prefix(&wasm_path);
        let dest_path = std::path::PathBuf::from(&community_folder_path)
            .join("BitsAndDroidsModule")
            .join(relative_path.unwrap());

        if let Some(parent_dir) = dest_path.parent() {
            match std::fs::create_dir_all(parent_dir) {
                Ok(_) => {}
                Err(e) => {
                    error!("Error creating dir: {:?}", e);
                }
            };
        }
        match std::fs::copy(file.path(), dest_path) {
            Ok(_) => {}
            Err(e) => {
                error!("Error copying file: {:?}", e);
            }
        };
    }
}

fn get_version_from_manifest() -> String {
    let exe_path = std::env::current_dir().unwrap();
    let wasm_path = exe_path.join("wasm_module");
    let manifest_path = wasm_path.join("manifest.json");
    let manifest = std::fs::read_to_string(manifest_path).unwrap();
    let parsed: serde_json::Value = serde_json::from_str(&manifest).unwrap();
    parsed["package_version"].as_str().unwrap().to_owned()
}

pub fn check_if_wasm_up_to_date(app: tauri::AppHandle) -> bool {
    //get last installed version from store
    println!("Checking if wasm is up to date");
    let store = app
        .store(".connectorSettings.dat")
        .expect("Failed to get store");

    let version_installed = match store.get("installedWASMVersion") {
        Some(v) => v.as_str().unwrap().to_owned(),
        None => "".to_string(),
    };

    let community_folder = match store.get("communityFolderPath") {
        Some(v) => v.as_str().unwrap().to_owned(),
        None => "".to_string(),
    };

    if community_folder.is_empty() && version_installed.is_empty() {
        return true;
    }

    //get latest version from manifest.json
    get_version_from_manifest() == version_installed
}

fn return_files_in_dir(dir: &str) -> Vec<std::fs::DirEntry> {
    let mut files = vec![];
    for entry in std::fs::read_dir(dir).unwrap() {
        let entry = entry.unwrap();
        if entry.file_type().unwrap().is_dir() {
            let files_rec = return_files_in_dir(entry.path().to_str().unwrap());
            for file in files_rec {
                files.push(file);
            }
            continue;
        }
        files.push(entry);
    }
    files
}
