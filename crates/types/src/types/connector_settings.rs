use serde::{Deserialize, Serialize};

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct SavedConnectorSettings {
    pub use_trs: Option<bool>,
    pub adc_resolution: Option<i32>,
    pub installed_wasm_version: Option<String>,
}

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct ConnectorSettings {
    pub use_trs: bool,
    pub adc_resolution: i32,
    pub installed_wasm_version: String,
}
