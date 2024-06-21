use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct ActionResponse {
    pub status: ActionResponseStatus,
    pub message: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub enum ActionResponseStatus {
    Success,
    Error,
}
