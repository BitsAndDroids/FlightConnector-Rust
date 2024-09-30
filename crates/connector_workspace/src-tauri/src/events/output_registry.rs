use std::collections::HashMap;

use connector_types::types::{category::Category, output::Output, wasm_event::WasmEvent};
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
        self.outputs.clear();
        for output in output_vec {
            self.outputs.insert(output.id, output);
        }
    }

    pub fn add_wasm_outputs(&mut self, outputs: &HashMap<u32, WasmEvent>) {
        for (id, wasm_output) in outputs {
            self.outputs.insert(*id, wasm_output.clone().into());
        }
    }
    pub fn get_output_by_id(&mut self, output_id: u32) -> Option<&Output> {
        self.outputs.get(&output_id)
    }

    pub fn set_output_value(&mut self, output_id: u32, value: f64) {
        if let Some(output) = self.outputs.get_mut(&output_id) {
            output.value = value;
        }
    }

    pub fn get_outputs(&self) -> &HashMap<u32, Output> {
        &self.outputs
    }
}
