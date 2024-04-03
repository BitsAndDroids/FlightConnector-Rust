use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct WasmEvent {
    pub id: u16,
    pub action: String,
    pub action_text: String,
    pub action_type: String,
    pub output_format: String,
    pub update_every: f32,
    pub min: f32,
    pub max: f32,
}
