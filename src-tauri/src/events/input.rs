use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct Input {
    pub event: String,
    pub input_type: i8,
    pub input_id: u32,
}
