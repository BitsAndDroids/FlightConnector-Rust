use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Output {
    pub output_name: String,
    pub metric: String,
    pub update_every: f32,
    pub cb_text: String,
    pub id: u32,
    pub output_type: i8,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub enum OutputType {
    String = 0,
    Integer = 1,
    Float = 2,
    Bool = 3,
}
