use serde::{Deserialize, Deserializer, Serialize};

use super::{
    output::{Output, OutputType},
    output_format::FormatOutput,
};

#[derive(Debug, Serialize, Clone)]
pub struct WasmEvent {
    pub id: u32,
    pub action: String,
    pub action_text: String,
    pub action_type: String,
    pub output_format: String,
    pub update_every: f32,
    pub min: f32,
    pub max: f32,
    pub value: f64,
    pub offset: u32,
}

impl<'de> Deserialize<'de> for WasmEvent {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        #[derive(Deserialize)]
        struct WasmEventHelper {
            id: u32,
            action: String,
            action_text: Option<String>,
            action_type: String,
            output_format: String,
            update_every: f32,
            min: f32,
            max: f32,
            value: Option<f64>,  // Use Option<u32> for fields that may be missing
            offset: Option<u32>, // Use Option<u32> for fields that may be missing
        }

        let helper = WasmEventHelper::deserialize(deserializer)?;

        // Use unwrap_or(default_value) to assign defaults if the fields are missing
        let value = helper.value.unwrap_or(0.0);
        let offset = helper.offset.unwrap_or(0);
        let action_text = helper.action_text.unwrap_or("".to_string());

        Ok(WasmEvent {
            id: helper.id,
            action: helper.action,
            action_text,
            action_type: helper.action_type,
            output_format: helper.output_format,
            update_every: helper.update_every,
            min: helper.min,
            max: helper.max,
            value,
            offset,
        })
    }
}

impl FormatOutput for WasmEvent {
    fn get_output_format(&self) -> Output {
        Output {
            simvar: self.action.clone(),
            metric: self.action_text.clone(),
            update_every: self.update_every,
            cb_text: self.action_text.clone(),
            id: self.id,
            output_type: OutputType::Integer as OutputType,
            category: "WASM".to_string(),
        }
    }
}
