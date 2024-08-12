use std::collections::HashMap;

use connector_types::types::{category::Category, output::Output};
use file_parsers::parsers::output_parser;

#[derive(Clone, Debug)]
pub struct OutputRegistry {
    pub categories: Vec<Category>,
    pub outputs: HashMap<u32, Output>,
    output_path: String,
}

impl OutputRegistry {
    pub fn new() -> OutputRegistry {
        OutputRegistry {
            categories: Vec::new(),
            outputs: HashMap::new(),
            output_path: String::from("src/events/outputs.json"),
        }
    }
    pub fn load_outputs(&mut self) {
        let output_vec = output_parser::get_outputs_from_file(&self.output_path);
        let mut outputs: HashMap<u32, Output> = HashMap::new();
        for output in output_vec {
            outputs.insert(output.id, output);
        }
    }

    pub fn get_output_by_id(&mut self, output_id: u32) -> Option<&mut Output> {
        self.outputs.get_mut(&output_id)
    }

    pub fn get_outputs(&self) -> &HashMap<u32, Output> {
        &self.outputs
    }
}
