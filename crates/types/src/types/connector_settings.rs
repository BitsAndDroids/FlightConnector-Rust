use serde::{Deserialize, Serialize};

#[derive(Clone, Serialize, Deserialize, Debug, Default)]
pub struct SavedConnectorSettings {
    pub use_trs: Option<bool>,
    pub adc_resolution: Option<i32>,
    pub installed_wasm_version: Option<String>,
}

#[derive(Clone, Serialize, Deserialize, Debug, Default)]
pub struct ConnectorSettings {
    pub use_trs: bool,
    pub adc_resolution: i32,
    pub installed_wasm_version: String,
}

impl From<SavedConnectorSettings> for ConnectorSettings {
    fn from(saved: SavedConnectorSettings) -> Self {
        Self {
            use_trs: saved.use_trs.unwrap_or(false),
            adc_resolution: saved.adc_resolution.unwrap_or(1023),
            installed_wasm_version: saved
                .installed_wasm_version
                .clone()
                .unwrap_or("".to_string()),
        }
    }
}
