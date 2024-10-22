use std::{collections::HashMap, fs, path::Path};

use connector_types::types::wasm_event::WasmEvent;
use tauri::{path::BaseDirectory, Manager};

use crate::events::{self};

#[tauri::command]
pub fn get_library_header_content(app: tauri::AppHandle) -> String {
    let mut content = String::new();
    let library_path = app.app_handle().path().resource_dir().unwrap();
    let resource_path = app
        .app_handle()
        .path()
        .resolve(
            "connectory_library/BitsAndDroidsFlightConnector.h",
            BaseDirectory::Resource,
        )
        .unwrap();
    if resource_path.exists() {
        content = fs::read_to_string(resource_path).unwrap();
    }
    content
}

#[tauri::command]
pub fn get_library_source_content(app: tauri::AppHandle) -> String {
    let mut content = String::new();
    let resource_path = app
        .app_handle()
        .path()
        .resolve(
            "connector_library/BitsAndDroidsFlightConnector.cpp",
            BaseDirectory::Resource,
        )
        .unwrap();
    if resource_path.exists() {
        content = fs::read_to_string(resource_path).unwrap();
    }
    content
}

#[tauri::command]
pub fn generate_library(
    app: tauri::AppHandle,
    path: String,
    header_string: String,
    source_string: String,
) {
    let library_path = Path::new(&path);
    let library_dest_path = library_path.join("BitsAndDroidsFlightSimLibrary");
    if let Err(e) = fs::create_dir_all(&library_dest_path) {
        println!("Failed to create destination directory: {}", e);
    }
    fs::write(
        library_dest_path.join("BitsAndDroidsFlightConnector.h"),
        header_string,
    )
    .unwrap();
    fs::write(
        library_dest_path.join("BitsAndDroidsFlightConnector.cpp"),
        source_string,
    )
    .unwrap();

    let resource_path = app.app_handle().path().resource_dir().unwrap();
    let lib_properties_path = resource_path.join("connector_library/library.properties");
    fs::copy(
        lib_properties_path,
        library_dest_path.join("library.properties"),
    )
    .unwrap();
    println!("Library generated in dir: {}", path);
}

#[tauri::command]
pub fn get_library_outputs(app: tauri::AppHandle) -> HashMap<u32, WasmEvent> {
    let mut outputs = HashMap::new();
    let mut wasm_registry = events::wasm_registry::WASMRegistry::new();
    wasm_registry.load_wasm(&app);
    let wasm_outputs = wasm_registry.get_wasm_outputs();
    for (_, output) in wasm_outputs {
        outputs.insert(output.id, output.clone());
    }
    outputs
}
