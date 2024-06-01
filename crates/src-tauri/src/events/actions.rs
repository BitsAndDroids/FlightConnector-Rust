use connector_types::types::action::Action;
use connector_types::types::action::ActionName;

fn throttle_action(values: &str) {
    println!("{}", values);
    println!("Test");
}

pub fn get_actions() -> Vec<Action> {
    vec![Action::new(ActionName::THROTTLE, Box::new(throttle_action))]
}
