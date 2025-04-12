use std::collections::HashMap;

use super::{action::Action, actions::get_actions};
pub struct ActionRegistry {
    actions: HashMap<u32, Action>,
    pub min_throttle: f32,
}

impl ActionRegistry {
    pub fn new() -> ActionRegistry {
        let actions = get_actions();
        ActionRegistry {
            actions,
            min_throttle: 0.0,
        }
    }

    pub fn set_min_throttle(&mut self, min_throttle: f32) {
        self.min_throttle = min_throttle;
    }

    pub fn get_action_by_id(&self, id: u32) -> Option<&Action> {
        self.actions.get(&id)
    }
}
