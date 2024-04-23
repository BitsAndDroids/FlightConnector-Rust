use std::path::Path;

use tauri::Manager;

#[tauri::command]
pub fn install_wasm(app: tauri::AppHandle, path: String) {
    let exe_path = std::env::current_dir().unwrap();
    let wasm_path = exe_path.join("wasm_module");
    println!("exe_path: {:?}", wasm_path);
    let mut files = return_files_in_dir(wasm_path.to_str().unwrap());
    for file in files {
        println!("file_dir: {:?}", file);
        let file_path = file.path().clone();
        let relative_path = file_path.strip_prefix(&wasm_path);
        let dest_path = Path::new(&path)
            .join("BitsAndDroidsModule")
            .join(relative_path.unwrap());
        if let Some(parent_dir) = dest_path.parent() {
            std::fs::create_dir_all(parent_dir);
        }
        //copy file to path
        println!("Copying file to: {:?}", dest_path);
        std::fs::copy(file.path(), dest_path);
    }

    println!("Installing wasm in dir: {}", path);
}

fn return_files_in_dir(dir: &str) -> Vec<std::fs::DirEntry> {
    let mut files = vec![];
    for entry in std::fs::read_dir(dir).unwrap() {
        let entry = entry.unwrap();
        if (entry.file_type().unwrap().is_dir()) {
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
