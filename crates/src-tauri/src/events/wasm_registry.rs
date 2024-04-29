use connector_types::types::wasm_event::WasmEvent;
#[derive(Debug)]
pub struct WASMRegistry {
    wasm_outputs: Vec<WasmEvent>,
    wasm_inputs: Vec<WasmEvent>,
    wasm_file_path: String,
}

impl WASMRegistry {
    pub fn new() -> WASMRegistry {
        WASMRegistry {
            wasm_outputs: Vec::new(),
            wasm_inputs: Vec::new(),
            wasm_file_path: String::from("wasm_module/modules/wasm_events.json"),
        }
    }

    pub fn load_wasm(&mut self) {
        let wasm_events =
            file_parsers::parsers::wasm_event_parser::parse_events_from_file(&self.wasm_file_path);
        self.wasm_outputs = wasm_events
            .clone()
            .into_iter()
            .filter(|event| event.action_type == "output")
            .collect();
        self.wasm_inputs = wasm_events
            .clone()
            .into_iter()
            .filter(|event| event.action_type == "input")
            .collect();
        println!("Input event count: {}", self.wasm_inputs.len());
    }

    pub fn get_wasm_output_by_id(&self, output_id: u32) -> Option<&WasmEvent> {
        self.wasm_outputs
            .iter()
            .find(|&output| output.id == output_id)
    }

    pub fn get_wasm_outputs(&self) -> &Vec<WasmEvent> {
        &self.wasm_outputs
    }

    pub fn get_wasm_inputs(&self) -> &Vec<WasmEvent> {
        &self.wasm_inputs
    }

    pub fn get_wasm_events(&self) -> Vec<WasmEvent> {
        let mut events = self.wasm_outputs.clone();
        let mut input_events = self.wasm_inputs.clone();
        vec![events, input_events].concat()
    }
}
