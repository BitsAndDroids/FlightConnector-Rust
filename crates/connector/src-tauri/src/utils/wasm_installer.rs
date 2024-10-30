use std::path::Path;

use log::error;
use serde_json::json;
use tauri_plugin_store::StoreExt;

#[tauri::command]
pub fn install_wasm(app: tauri::AppHandle) {
    let exe_path = std::env::current_dir().unwrap();
    let wasm_path = exe_path.join("wasm_module");
    let version = get_version_from_manifest();
    let mut community_folder_path = "".to_owned();
    //TODO: handle unwraps
    let store = app.store(".connectorSettings.dat").unwrap();
    if let Some(v) = store.get("communityFolderPath") {
        community_folder_path = v.to_owned().to_string();
        store.set("installedWASMVersion".to_owned(), json!(version))
    }
    store.close_resource();

    let files = return_files_in_dir(wasm_path.to_str().unwrap());
    for file in files {
        // check if file contains wasm_event.json and skip it
        if file.path().to_str().unwrap().contains("wasm_events.json") {
            continue;
        }
        let file_path = file.path().clone();
        let relative_path = file_path.strip_prefix(&wasm_path);
        let dest_path = Path::new(&community_folder_path)
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
    let store = app.store(".connectorSettings.dat").unwrap();

    let version: String = store
        .get("installedWASMVersion")
        .unwrap()
        .as_str()
        .unwrap()
        .to_owned();
    let community_folder: String = store
        .get("communityFolderPath")
        .unwrap()
        .as_str()
        .unwrap()
        .to_owned();

    if community_folder.is_empty() && version.is_empty() {
        return true;
    }

    //get latest version from manifest.json
    get_version_from_manifest() == version
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
