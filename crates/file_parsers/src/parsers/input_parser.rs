use connector_types::types::input::Input;
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
struct Data {
    inputs: Vec<Input>,
}
pub fn get_inputs_from_file(path: &str) -> Vec<Input> {
    let file = match std::fs::File::open(path) {
        Ok(file) => file,
        Err(e) => panic!("Failed to open file at {:?}: {}", &path, e),
    };

    let reader = std::io::BufReader::new(file);

    let inputs: Data = match serde_json::from_reader(reader) {
        Ok(data) => data,
        Err(e) => panic!("Failed to parse inputs from file: {}", e),
    };
    inputs.inputs
}
