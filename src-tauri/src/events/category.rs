pub mod category {
    use serde::{Deserialize, Serialize};

    use crate::events::output::output::Output;
    #[derive(Clone, Serialize, Deserialize, Debug)]
    pub struct Category {
        pub name: String,
        pub outputs: Vec<Output>,
    }
}
