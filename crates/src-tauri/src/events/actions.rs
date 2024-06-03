use std::collections::HashMap;

use simconnect::SimConnector;

use super::action::{Action, ActionName};

fn throttle_action(connector: &SimConnector, values: String) {
    println!("{}", values);
    println!("TEST THROTTLE ACTION");
}

pub fn get_actions() -> HashMap<u32, Action> {
    let mut action_map = HashMap::new();
    action_map.insert(
        199,
        Action::new(199, ActionName::THROTTLE, Box::new(throttle_action)),
    );
    action_map
}
