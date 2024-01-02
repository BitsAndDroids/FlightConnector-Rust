use serde::{Deserialize, Serialize};
use simconnect::DWORD;

#[derive(Serialize, Deserialize, Clone)]
pub struct Output {
    pub output_name: String,
    pub metric: String,
    pub update_every: f32,
    pub cb_text: String,
    pub prefix: DWORD,
    pub output_type: DWORD,
}
