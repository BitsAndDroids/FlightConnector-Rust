use file_parsers::parsers::input_parser;
use std::env;
fn main() {
    generate_input_list();
}

fn generate_input_list() {
    //
    let current_dir = env::current_dir().expect("Failed to get current directory");

    // Navigate to the target directory
    let target_dir = current_dir
        .parent()
        .expect("Failed to get parent directory")
        .parent()
        .expect("Failed to get grandparent directory")
        .parent()
        .expect("Failed to get great-grandparent directory")
        .join("crates\\src-tauri\\src\\events");
    let file_path = target_dir.join("inputs.json");
    let converted_path = file_path.to_str().unwrap();
    let inputs = input_parser::get_inputs_from_file(converted_path);
    println!("Inputs: {:?}", inputs);
}
