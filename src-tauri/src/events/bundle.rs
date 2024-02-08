use super::output::Output;
use serde::{Deserialize, Serialize};
#[derive(Serialize, Deserialize, Debug)]
pub struct Bundle {
    pub name: String,
    pub version: i32,
    pub outputs: Vec<Output>,
}
