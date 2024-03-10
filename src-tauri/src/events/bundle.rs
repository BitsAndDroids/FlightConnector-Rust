pub mod bundle {
    use serde::{Deserialize, Serialize};

    use crate::events::output::output::Output;

    #[derive(Serialize, Deserialize, Debug)]
    pub struct Bundle {
        pub name: String,
        pub version: i32,
        pub outputs: Vec<Output>,
    }
}
