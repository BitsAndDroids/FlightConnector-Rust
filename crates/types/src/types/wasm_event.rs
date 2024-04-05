use serde::{Deserialize, Serialize};

use super::{
    output::{Output, OutputType},
    output_format::FormatOutput,
};

#[derive(Debug, Serialize, Deserialize, Clone)]
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

impl FormatOutput for WasmEvent {
    fn get_output_format(&self) -> Output {
        Output {
            simvar: self.action.clone(),
            metric: self.action_text.clone(),
            update_every: self.update_every,
            cb_text: self.action_text.clone(),
            id: self.id as u32,
            output_type: OutputType::Integer as OutputType,
            category: "WASM".to_string(),
        }
    }
}
