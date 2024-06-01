pub struct ActionRegistry {
    actions: Vec<Action>,
}

impl ActionRegistry {
    pub fn new() -> ActionRegistry {
        ActionRegistry {
            actions: Vec::new(),
        }
    }
}
