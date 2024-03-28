use serde::{Deserialize, Serialize};

use super::output::Output;

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct Category {
    pub name: String,
    pub outputs: Vec<Output>,
}
