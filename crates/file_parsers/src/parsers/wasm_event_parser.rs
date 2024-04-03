use connector_types::types::wasm_event::WasmEvent;

pub fn parse_events_from_file(path: &str) -> Vec<WasmEvent> {
    let wasm_events: Vec<WasmEvent> = Vec::new();
    let file = match std::fs::File::open(path) {
        Ok(file) => file,
        Err(e) => panic!("Failed to open file at {:?}: {}", &path, e),
    };
    let reader = std::io::BufReader::new(file);
    let events: Vec<WasmEvent> = match serde_json::from_reader(reader) {
        Ok(data) => data,
        Err(e) => panic!("Failed to parse events from file: {}", e),
    };
    events
}
