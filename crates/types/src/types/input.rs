use std::fmt::Display;

use serde::{Deserialize, Serialize};
#[derive(Serialize, Deserialize, Debug)]
pub struct Input {
    pub event: String,
    pub input_type: InputType,
    pub input_id: u32,
}

#[derive(Serialize, Debug)]
pub enum InputType {
    Trigger,
    SetValue,
    SetValueCom,
    SetValueBool,
}

impl Display for InputType {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let s = match self {
            InputType::Trigger => "Trigger",
            InputType::SetValue => "SetValue",
            InputType::SetValueCom => "SetValueCom",
            InputType::SetValueBool => "SetValueBool",
        };
        write!(f, "{}", s)
    }
}

impl<'de> Deserialize<'de> for InputType {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        {
            let s: String = Deserialize::deserialize(deserializer)?;
            match s.to_lowercase().as_str() {
                "trigger" => Ok(InputType::Trigger),
                "set_value" => Ok(InputType::SetValue),
                "set_value_com" => Ok(InputType::SetValueCom),
                "set_value_bool" => Ok(InputType::SetValueBool),
                _ => Err(serde::de::Error::custom(format!(
                    "Invalid input type: {}",
                    s
                ))),
            }
        }
    }
}
