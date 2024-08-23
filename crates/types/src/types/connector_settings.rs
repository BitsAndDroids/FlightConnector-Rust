use serde::{Deserialize, Serialize};

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct SavedConnectorSettings {
    pub use_trs: Option<bool>,
    pub adc_resolution: Option<i32>,
    pub installed_wasm_version: Option<String>,
    pub send_every_ms: Option<u64>,
}

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct ConnectorSettings {
    pub use_trs: bool,
    pub adc_resolution: i32,
    pub installed_wasm_version: String,
    pub send_every_ms: u64,
}

impl From<SavedConnectorSettings> for ConnectorSettings {
    fn from(saved: SavedConnectorSettings) -> Self {
        ConnectorSettings {
            use_trs: saved.use_trs.unwrap_or(false),
            adc_resolution: saved.adc_resolution.unwrap_or(1023),
            installed_wasm_version: saved.installed_wasm_version.unwrap_or("".to_string()),
            send_every_ms: saved.send_every_ms.unwrap_or(6),
        }
    }
}
