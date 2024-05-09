use connector_types::types::input::Input;
use connector_types::types::output::Output;
use file_parsers::parsers::{input_parser, output_parser};
use std::{env, path::PathBuf};

trait EventMD {
    fn to_md_row(&self) -> String;
    fn md_header() -> String;
    fn md_file_path() -> String;
}

impl EventMD for Input {
    fn to_md_row(&self) -> String {
        let row = format!(
            "| {} | {} | {} |\n",
            self.event, self.input_type, self.input_id
        );
        row
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
            .join("connector-docs\\src\\generated\\input_list.md");
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
            "| Simvar | Metric | Update Every | Callback Text | ID | Output Type | Category |\n",
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
            .join("connector-docs\\src\\generated\\output_list.md");
        return target_dir.to_str().unwrap().to_string();
    }
}
fn main() {
    generate_input_list();
    generate_output_list();
}
fn normalize_path(path: &PathBuf) -> PathBuf {
    // Convert backslashes to forward slashes for cross-platform compatibility
    let mut normalized = PathBuf::new();
    for component in path.components() {
        #[cfg(target_os = "linux")]
        if let Some(component) = component.as_os_str().to_str() {
            if component == "FlightConnector-Rust" {
                continue;
            }
        }
        normalized.push(component.as_os_str());
    }

    normalized
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
    let normalized_path = normalize_path(&file_path);
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
        .join("crates\\src-tauri\\src\\events");
    let file_path = target_dir.join("outputs.json");
    let normalized_path = normalize_path(&file_path);
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
