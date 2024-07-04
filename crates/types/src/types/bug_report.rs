use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct BugReport {
    pub id: String,
    pub discord_name: String,
    pub gh_issue_nr: i32,
    pub events: String,
    pub bundle_settings: String,
    pub presets: String,
    pub run_settings: String,
    pub logs: String,
}
