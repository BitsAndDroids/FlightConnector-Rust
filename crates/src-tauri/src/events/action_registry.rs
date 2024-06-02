use std::collections::HashMap;

use super::{action::Action, actions::get_actions};
pub struct ActionRegistry {
    actions: HashMap<u32, Action>,
}

impl ActionRegistry {
    pub fn new() -> ActionRegistry {
        let actions = get_actions();
        ActionRegistry { actions }
    }

    pub fn load_actions(&mut self) {
        self.actions = get_actions();
    }

    pub fn get_action_by_id(&self, id: u32) -> Option<&Action> {
        return self.actions.get(&id);
    }
}
