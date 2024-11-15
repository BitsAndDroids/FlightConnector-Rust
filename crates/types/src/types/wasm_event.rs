use serde::{
    de::{self, SeqAccess, Visitor},
    Deserialize, Deserializer, Serialize,
};
use std::fmt;
use std::str::FromStr;

use super::output::{Output, OutputType};

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
    pub plane_or_category: Vec<String>,
    pub made_by: String,
}

fn deserialize_id<'de, D>(deserializer: D) -> Result<u32, D::Error>
where
    D: Deserializer<'de>,
{
    struct IdVisitor;

    impl<'de> Visitor<'de> for IdVisitor {
        type Value = u32;

        fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
            formatter.write_str("a string or integer representing an id")
        }

        fn visit_str<E>(self, value: &str) -> Result<Self::Value, E>
        where
            E: de::Error,
        {
            u32::from_str(value).map_err(E::custom)
        }

        fn visit_u64<E>(self, value: u64) -> Result<Self::Value, E>
        where
            E: de::Error,
        {
            Ok(value as u32)
        }
    }

    deserializer.deserialize_any(IdVisitor)
}

fn deserialize_plane_or_category<'de, D>(deserializer: D) -> Result<Vec<String>, D::Error>
where
    D: Deserializer<'de>,
{
    struct PlaneOrCategoryVisitor;

    impl<'de> Visitor<'de> for PlaneOrCategoryVisitor {
        type Value = Vec<String>;

        fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
            formatter.write_str("a string or a list of strings")
        }

        fn visit_str<E>(self, value: &str) -> Result<Self::Value, E>
        where
            E: de::Error,
        {
            Ok(vec![value.to_string()])
        }

        fn visit_seq<A>(self, mut seq: A) -> Result<Self::Value, A::Error>
        where
            A: SeqAccess<'de>,
        {
            let mut vec = Vec::new();
            while let Some(value) = seq.next_element()? {
                vec.push(value);
            }
            Ok(vec)
        }
    }

    deserializer.deserialize_any(PlaneOrCategoryVisitor)
}

impl<'de> Deserialize<'de> for WasmEvent {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        #[derive(Deserialize)]
        struct WasmEventHelper {
            #[serde(deserialize_with = "deserialize_id")]
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
            #[serde(deserialize_with = "deserialize_plane_or_category")]
            plane_or_category: Vec<String>,
            made_by: Option<String>,
        }

        let helper = WasmEventHelper::deserialize(deserializer)?;

        // Use unwrap_or(default_value) to assign defaults if the fields are missing
        let value = helper.value.unwrap_or(0.0);
        let offset = helper.offset.unwrap_or(0);
        let action_text = helper.action_text.unwrap_or("".to_string());
        let made_by = helper.made_by.unwrap_or("BitsAndDroids".to_string());

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
            plane_or_category: helper.plane_or_category,
            made_by,
        })
    }
}

impl From<WasmEvent> for Output {
    fn from(event: WasmEvent) -> Self {
        let output_type: OutputType = match event.output_format.as_str() {
            "boolean" => OutputType::Boolean,
            "int" => OutputType::Integer,
            "float" => OutputType::Float,
            "string" => OutputType::String,
            _ => OutputType::Integer,
        };
        Output {
            simvar: event.action,
            metric: event.action_text.clone(),
            update_every: event.update_every,
            cb_text: event.action_text,
            id: event.id,
            output_type,
            category: "WASM".to_string(),
            value: 0.0,
            custom: true,
        }
    }
}
