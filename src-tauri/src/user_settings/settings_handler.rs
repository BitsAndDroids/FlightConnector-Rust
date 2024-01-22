use std::io::{Read, Write};

struct SettingsHandler {
    settings_path: String,
}

impl SettingsHandler {
    pub fn new(settings_path: String) -> SettingsHandler {
        SettingsHandler {
            settings_path: settings_path,
        }
    }
    pub fn get_settings(&self) -> String {
        let mut settings_file = std::fs::File::open(&self.settings_path).unwrap();
        let mut settings = String::new();
        settings_file.read_to_string(&mut settings).unwrap();
        settings
    }
    pub fn save_settings(&self, settings: String) {
        let mut settings_file = std::fs::File::create(&self.settings_path).unwrap();
        settings_file.write_all(settings.as_bytes()).unwrap();
    }
}

