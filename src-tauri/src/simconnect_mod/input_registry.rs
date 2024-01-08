use std::collections::HashMap;
use simconnect::SIMCONNECT_CLIENT_EVENT_ID;
use crate::events::input::{Input};
use crate::events::input_parser::output_parser::get_inputs_from_file;

#[derive(Debug)]
pub struct InputRegistry {
    pub(crate) inputs: HashMap<i32, Input>,
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
            self.inputs.insert(input.input_id.clone(), input);
        }
    }
    pub fn get_inputs(&self) -> &HashMap<i32, Input> {
        &self.inputs
    }
    pub fn get_input(&self, input_id: i32) -> Option<&Input> {
        self.inputs.get(&input_id)
    }

    pub fn define_inputs(&self, conn: &mut simconnect::SimConnector){
        for input in &self.inputs {
            conn.map_client_event_to_sim_event(
                input.0.clone() as SIMCONNECT_CLIENT_EVENT_ID,
                input.1.event.as_str(),
            );
        }
    }
}