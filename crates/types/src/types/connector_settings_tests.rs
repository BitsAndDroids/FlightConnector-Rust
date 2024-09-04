#[cfg(test)]
use crate::types::connector_settings::ConnectorSettings;

use super::SavedConnectorSettings;

#[test]
fn test_setting_default_settings_missing_settings() {
    let saved_settings = SavedConnectorSettings {
        adc_resolution: None,
        send_every_ms: None,
        use_trs: None,
        installed_wasm_version: None,
    };
    let settings = ConnectorSettings::from(saved_settings);
    assert_eq!(settings.adc_resolution, 1023);
    assert_eq!(settings.send_every_ms, 6);
    assert!(!settings.use_trs);
    assert_eq!(settings.installed_wasm_version, "");
}
