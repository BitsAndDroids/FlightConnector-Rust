use std::fmt::Display;

use serde::{Deserialize, Serialize};

use super::{output_format::FormatOutput, WasmEvent};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Output {
    pub simvar: String,
    pub metric: String,
    pub update_every: f32,
    pub cb_text: String,
    pub id: u32,
    pub output_type: OutputType,
    pub category: String,
    pub value: String,
}

#[derive(Serialize, Clone, Debug)]
pub enum OutputType {
    Boolean,
    Integer,
    Float,
    Float1DecPlaces,
    Float2DecPlaces,
    Seconds,
    Secondsaftermidnight,
    Percentage,
    Degrees,
    ADF,
    INHG,
    Meterspersecond,
    MeterspersecondToKnots,
    String,
}

impl Display for OutputType {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let s = match self {
            OutputType::ADF => "ADF",
            OutputType::Float => "Float",
            OutputType::Float1DecPlaces => "Float1DecPlaces",
            OutputType::Float2DecPlaces => "Float2DecPlaces",
            OutputType::Boolean => "Boolean",
            OutputType::Integer => "Integer",
            OutputType::Seconds => "Seconds",
            OutputType::Secondsaftermidnight => "SecondsAfterMidnight",
            OutputType::Percentage => "Percentage",
            OutputType::Degrees => "Degrees",
            OutputType::INHG => "INHG",
            OutputType::Meterspersecond => "MetersPerSecond",
            OutputType::MeterspersecondToKnots => "MetersPerSecondToKnots",
            OutputType::String => "String",
        };
        write!(f, "{}", s)
    }
}

impl<'de> Deserialize<'de> for OutputType {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let s: String = Deserialize::deserialize(deserializer)?;
        match s.to_lowercase().as_str() {
            "adf" => Ok(OutputType::ADF),
            "boolean" => Ok(OutputType::Boolean),
            "integer" => Ok(OutputType::Integer),
            "float" => Ok(OutputType::Float),
            "float1decplaces" => Ok(OutputType::Float1DecPlaces),
            "float2decplaces" => Ok(OutputType::Float2DecPlaces),
            "seconds" => Ok(OutputType::Seconds),
            "secondsaftermidnight" => Ok(OutputType::Secondsaftermidnight),
            "percentage" => Ok(OutputType::Percentage),
            "degrees" => Ok(OutputType::Degrees),
            "inhg" => Ok(OutputType::INHG),
            "meterspersecond" => Ok(OutputType::Meterspersecond),
            "meterspersecondtoknots" => Ok(OutputType::MeterspersecondToKnots),
            "string" => Ok(OutputType::String),
            _ => Err(serde::de::Error::custom(format!(
                "Unknown output type: {}",
                s
            ))),
        }
    }
}

impl FormatOutput for Output {
    fn get_output_format(&self) -> Output {
        self.clone()
    }
}

impl From<WasmEvent> for Output {
    fn from(wasm: WasmEvent) -> Self {
        let output_type: OutputType = match wasm.output_format.as_str() {
            "boolean" => OutputType::Boolean,
            "int" => OutputType::Integer,
            "float" => OutputType::Float,
            "string" => OutputType::String,
            _ => OutputType::Integer,
        };
        Self {
            simvar: wasm.action.clone(),
            metric: wasm.action_text.clone(),
            update_every: wasm.update_every,
            cb_text: wasm.action_text.clone(),
            id: wasm.id,
            output_type,
            category: "WASM".to_string(),
            value: "0".to_string(),
        }
    }
}
