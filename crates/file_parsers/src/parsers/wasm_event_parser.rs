use connector_types::types::wasm_event::WasmEvent;
use serde::{Deserialize, Serialize};
#[derive(Debug, Serialize, Deserialize)]
pub struct EventFile {
    pub version: String,
    pub events: Vec<WasmEvent>,
}
pub fn parse_events_from_file(path: &str) -> EventFile {
    let file = match std::fs::File::open(path) {
        Ok(file) => file,
        Err(e) => panic!("Failed to open file at {:?}: {}", &path, e),
    };
    let reader = std::io::BufReader::new(file);
    let events: EventFile = match serde_json::from_reader(reader) {
        Ok(data) => data,
        Err(e) => panic!("Failed to parse events from file: {}", e),
    };
    events
}
