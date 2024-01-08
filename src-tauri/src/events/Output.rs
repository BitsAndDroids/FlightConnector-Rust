use serde::{Deserialize, Serialize};
use simconnect::DWORD;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Output {
    pub output_name: String,
    pub metric: String,
    pub update_every: f32,
    pub cb_text: String,
    pub id: DWORD,
    pub output_type: DWORD,
}
