use connector_types::types::output::Output;
use connector_types::types::{input::Input, library_function::LibraryFunction};
use file_parsers::parsers::library_function_parser::get_outgoing_functions_from_file;
use file_parsers::parsers::{input_parser, library_function_parser, output_parser};
use std::{env, path::PathBuf};

struct LibraryEvents {
    name: String,
    id: u16,
}

trait EventMD {
    fn to_md_row(&self) -> String;
    fn md_header() -> String;
    fn md_file_path() -> String;
}

impl EventMD for LibraryFunction {
    fn to_md_row(&self) -> String {
        format!(
            "| {} | {} | {} | {} |\n",
            self.name,
            self.direction,
            self.return_type,
            self.parameters.join(", ")
        )
    }

    fn md_header() -> String {
        "# Library Functions\n| Name | Direction | Return Type | Parameters |\n| --- | --- | --- | --- |\n".to_string()
    }

    fn md_file_path() -> String {
        let current_dir = env::current_dir().expect("Failed to get current directory");
        let target_dir = current_dir
            .parent()
            .expect("Failed to get parent directory")
            .parent()
            .expect("Failed to get grandparent directory")
            .parent()
            .expect("Failed to get great-grandparent directory")
            .join("connector-docs/src/generated/library_list.md");
        return target_dir.to_str().unwrap().to_string();
    }
}

impl EventMD for Input {
    fn to_md_row(&self) -> String {
        format!(
            "| {} | {} | {} |\n",
            self.event, self.input_type, self.input_id
        )
    }
    fn md_header() -> String {
        let mut md = String::new();
        md.push_str("# Inputs\n");
        md.push_str("| Event | Input Type | Input ID |\n");
        md.push_str("| --- | --- | --- |\n");
        md
    }
    fn md_file_path() -> String {
        let current_dir = env::current_dir().expect("Failed to get current directory");
        let target_dir = current_dir
            .parent()
            .expect("Failed to get parent directory")
            .parent()
            .expect("Failed to get grandparent directory")
            .parent()
            .expect("Failed to get great-grandparent directory")
            .join("connector-docs/src/generated/input_list.md");
        return target_dir.to_str().unwrap().to_string();
    }
}

impl EventMD for Output {
    fn to_md_row(&self) -> String {
        let row = format!(
            "| {} | {} | {} | {} | {} | {} | {} |\n",
            self.simvar,
            self.metric,
            self.update_every,
            self.cb_text,
            self.id,
            self.output_type,
            self.category
        );
        row
    }
    fn md_header() -> String {
        let mut md = String::new();
        md.push_str("# Outputs\n");
        md.push_str(
            "| Simvar | Metric | Update Every | Callback Text | Id | Output Type | Category |\n",
        );
        md.push_str("| --- | --- | --- | --- | --- | --- | --- |\n");
        md
    }
    fn md_file_path() -> String {
        let current_dir = env::current_dir().expect("Failed to get current directory");
        let target_dir = current_dir
            .parent()
            .expect("Failed to get parent directory")
            .parent()
            .expect("Failed to get grandparent directory")
            .parent()
            .expect("Failed to get great-grandparent directory")
            .join("connector-docs/src/generated/output_list.md");
        return target_dir.to_str().unwrap().to_string();
    }
}
fn main() {
    generate_input_list();
    generate_output_list();
    generate_library_list();
}
fn normalize_path(path: &PathBuf) -> PathBuf {
    // Convert backslashes to forward slashes for cross-platform compatibility
    let mut normalized = PathBuf::new();
    for component in path.components() {
        normalized.push(component.as_os_str());
    }
    normalized.to_path_buf()
}

fn generate_library_list() {
    //
    let current_dir = env::current_dir().expect("Failed to get current directory");
    let target_dir = current_dir
        .parent()
        .expect("Failed to get parent directory")
        .parent()
        .expect("Failed to get grandparent directory")
        .parent()
        .expect("Failed to get great-grandparent directory")
        .join("crates/src-tauri/connector_library/BitsAndDroidsFlightConnector.h");
    let normalized_path = normalize_path(&target_dir);
    let converted_path = normalized_path.to_str().unwrap();
    let functions: Vec<LibraryFunction> = get_outgoing_functions_from_file(converted_path);
    generate_md_list(functions);
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
        .join("crates/connector/src-tauri/src/events/inputs.json");
    let normalized_path = normalize_path(&target_dir);
    let converted_path = normalized_path.to_str().unwrap();
    let inputs = input_parser::get_inputs_from_file(converted_path);
    generate_md_list(inputs);
}

fn generate_output_list() {
    let current_dir = env::current_dir().expect("Failed to get current directory");
    // Navigate to the target directory
    let target_dir = current_dir
        .parent()
        .expect("Failed to get parent directory")
        .parent()
        .expect("Failed to get grandparent directory")
        .parent()
        .expect("Failed to get great-grandparent directory")
        .join("crates/connector/src-tauri/src/events/outputs.json");
    let normalized_path = normalize_path(&target_dir);
    let converted_path = normalized_path.to_str().unwrap();

    let outputs = output_parser::get_outputs_from_file(converted_path);
    generate_md_list(outputs);
}

fn generate_md_list<T: EventMD>(json: Vec<T>) {
    //create markdown string
    let mut md = String::new();
    md.push_str(&T::md_header());
    for input in json {
        md.push_str(&input.to_md_row());
    }
    println!("{}", md);
    save_to_file(md, T::md_file_path());
}

fn save_to_file(md: String, path: String) {
    // check if file exists
    // if it does, overwrite it
    // if it doesn't, create it
    std::fs::write(path, md).expect("Failed to write to file");
}
