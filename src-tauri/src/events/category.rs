use crate::events::output::Output;
use serde::{Deserialize, Serialize};
#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct Category {
    pub name: String,
    pub outputs: Vec<Output>,
}
