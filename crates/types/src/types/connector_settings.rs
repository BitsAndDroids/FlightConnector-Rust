use serde::{Deserialize, Serialize};

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct ConnectorSettings {
    pub use_trs: bool,
}
