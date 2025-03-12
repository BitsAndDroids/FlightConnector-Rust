#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct SimvarUpdate {
    pub id: u32,
    pub value: f64,
}
