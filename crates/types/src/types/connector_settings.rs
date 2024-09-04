#[cfg(test)]
#[path = "connector_settings_tests.rs"]
mod connector_settings_tests;

use serde::{Deserialize, Serialize};

pub const USE_TRS: bool = false;
pub const ADC_RESOLUTION: i32 = 1023;
pub const INSTALLED_WASM_VERSION: &str = "";
pub const SEND_EVERY_MS: u64 = 6;

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
            use_trs: saved.use_trs.unwrap_or(USE_TRS),
            adc_resolution: saved.adc_resolution.unwrap_or(ADC_RESOLUTION),
            installed_wasm_version: saved
                .installed_wasm_version
                .unwrap_or(INSTALLED_WASM_VERSION.to_string()),
            send_every_ms: saved.send_every_ms.unwrap_or(SEND_EVERY_MS),
        }
    }
}

impl ConnectorSettings {
    pub fn get_default_settings() -> Self {
        ConnectorSettings {
            use_trs: USE_TRS,
            adc_resolution: ADC_RESOLUTION,
            installed_wasm_version: INSTALLED_WASM_VERSION.to_string(),
            send_every_ms: SEND_EVERY_MS,
        }
    }
}
