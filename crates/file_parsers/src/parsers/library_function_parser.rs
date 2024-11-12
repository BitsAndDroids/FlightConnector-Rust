use std::fs::read_to_string;

use connector_types::types::library_function::LibraryFunction;

pub fn get_outgoing_functions_from_file(path: &str) -> Vec<LibraryFunction> {
    let file_content =
        read_to_string(path).unwrap_or_else(|_| panic!("Failed to open file at {:?}", &path));
    // let mut get_function_string = "".to_string();
    let mut functions: Vec<LibraryFunction> = Vec::new();
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
            let return_type = line.split_whitespace().next().unwrap();
            println!("{}", return_type);
            let function_name = line.split_whitespace().nth(1).unwrap();
            let function: LibraryFunction = LibraryFunction {
                name: (function_name.to_string()),
                direction: ("Out".to_string()),
                return_type: (return_type.to_string()),
                parameters: vec!["".to_string()],
            };
            functions.push(function);
        }
    }
    functions
}
