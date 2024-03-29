use std::fmt::Display;

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Output {
    pub simvar: String,
    pub metric: String,
    pub update_every: f32,
    pub cb_text: String,
    pub id: u32,
    pub output_type: OutputType,
    pub category: String,
}

#[derive(Serialize, Clone, Debug)]
pub enum OutputType {
    Boolean,
    Integer,
    Seconds,
    Secondsaftermidnight,
    Percentage,
    Degrees,
    ADF,
    INHG,
    Meterspersecond,
}

impl Display for OutputType {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let s = match self {
            OutputType::ADF => "ADF",
            OutputType::Boolean => "Boolean",
            OutputType::Integer => "Integer",
            OutputType::Seconds => "Seconds",
            OutputType::Secondsaftermidnight => "SecondsAfterMidnight",
            OutputType::Percentage => "Percentage",
            OutputType::Degrees => "Degrees",
            OutputType::INHG => "INHG",
            OutputType::Meterspersecond => "MetersPerSecond",
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
            "seconds" => Ok(OutputType::Seconds),
            "secondsaftermidnight" => Ok(OutputType::Secondsaftermidnight),
            "percentage" => Ok(OutputType::Percentage),
            "degrees" => Ok(OutputType::Degrees),
            "inhg" => Ok(OutputType::INHG),
            "meterspersecond" => Ok(OutputType::Meterspersecond),
            _ => Err(serde::de::Error::custom(format!(
                "Unknown output type: {}",
                s
            ))),
        }
    }
}
