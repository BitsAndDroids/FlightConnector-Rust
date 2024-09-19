use std::fs::read_to_string;

use connector_types::types::library_function::LibraryFunction;

pub fn get_outgoing_functions_from_file(path: &str) -> Vec<String> {
    let file_content =
        read_to_string(path).unwrap_or_else(|_| panic!("Failed to open file at {:?}", &path));
    let mut get_function_string = "".to_string();
    let mut strings: Vec<String> = Vec::new();
    let mut read_mode = false;
    for line in file_content.lines() {
        if line.contains("public:") {
            read_mode = true;
        }
        if line.contains("private:") {
            break;
        }
        if line.contains("get") && read_mode {
            println!("{}", line);
            strings.push(line.to_string());
        }
    }
    strings
}
