pub mod output_parser {
    use serde::{Deserialize, Serialize};

    use crate::events::input::Input;

    #[derive(Deserialize, Serialize)]
    struct Data {
        inputs: Vec<Input>,
    }
    pub fn get_inputs_from_file(path: &str) -> Vec<Input> {
        let file = std::fs::File::open(path)
            .unwrap_or_else(|_| panic!("Failed to open file at {:?}", &path));
        let reader = std::io::BufReader::new(file);

        let inputs: Data = match serde_json::from_reader(reader) {
            Ok(data) => data,
            Err(e) => panic!("Failed to parse inputs from file: {}", e),
        };
        inputs.inputs
    }
}
