pub mod input_registry {
    use connector_types::types::input::Input;
    use file_parsers::parsers::input_parser::get_inputs_from_file;
    use std::collections::HashMap;
    #[derive(Debug)]
    pub struct InputRegistry {
        pub inputs: HashMap<u32, Input>,
        input_path: String,
    }

    impl InputRegistry {
        pub fn new() -> InputRegistry {
            InputRegistry {
                inputs: HashMap::new(),
                input_path: "src/events/inputs.json".parse().unwrap(),
            }
        }
        pub fn load_inputs(&mut self) {
            let inputs = get_inputs_from_file(self.input_path.as_str());
            for input in inputs {
                self.inputs.insert(input.input_id, input);
            }
        }
        pub fn get_inputs(&self) -> &HashMap<u32, Input> {
            &self.inputs
        }
        pub fn get_input(&self, input_id: u32) -> Option<&Input> {
            self.inputs.get(&input_id)
        }
    }
}
