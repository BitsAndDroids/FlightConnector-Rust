use std::fs;

use tauri::Manager;

#[tauri::command]
pub fn get_library_header_content(app: tauri::AppHandle) -> String {
    let mut content = String::new();
    let library_path = app.app_handle().path().resource_dir().unwrap();
    let library_header_path = library_path.join("connector_library/BitsAndDroidsFlightConnector.h");
    println!("Library header path: {:?}", library_header_path);
    if library_header_path.exists() {
        content = fs::read_to_string(library_header_path).unwrap();
    }
    content
}

#[tauri::command]
pub fn get_library_source_content(app: tauri::AppHandle) -> String {
    let mut content = String::new();
    let library_path = app.app_handle().path().resource_dir().unwrap();
    let library_source_path =
        library_path.join("connector_library/BitsAndDroidsFlightConnector.cpp");
    println!("Library source path: {:?}", library_source_path);
    if library_source_path.exists() {
        content = fs::read_to_string(library_source_path).unwrap();
    }
    content
}
