pub mod run_bundle {
    use serde::{Deserialize, Serialize};

    use crate::events::bundle::bundle::Bundle;

    #[derive(Debug, Serialize, Deserialize)]
    pub struct RunBundle {
        pub id: i32,
        pub com_port: String,
        pub bundle: Bundle,
    }
}
