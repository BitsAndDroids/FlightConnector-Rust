use std::collections::HashMap;

use simconnect::{SimConnector, DWORD};

use crate::sim_utils::input_converters::map_analog_to_axis;

use super::action::{Action, ActionName};

fn throttle_action(connector: &SimConnector, values: String, modifier: f32, adc_res: i32) {
    // The throttle action is received as a string of 5 values separated by spaces
    // The first value is the Id of the action
    // The 2nd, 3th, 4th and 5th values are the throttle values for the engines
    let values: Vec<&str> = values.split(' ').collect();

    println!("modifier: {}", modifier);

    // The event id of the first engine = 207 we can add 1 to get the event id of the other engines
    for (index, value) in values.iter().skip(1).enumerate() {
        connector.transmit_client_event(
            0,
            207 + index as u32,
            map_analog_to_axis(modifier, adc_res as f32, value.parse::<i32>().unwrap()) as DWORD,
            simconnect::SIMCONNECT_GROUP_PRIORITY_HIGHEST,
            simconnect::SIMCONNECT_EVENT_FLAG_GROUPID_IS_PRIORITY,
        );
    }
}

fn mixture_action(connector: &SimConnector, values: String, _modifier: f32, adc_res: i32) {
    // The mixture action is received as a string of 5 values separated by spaces
    // The first value is the Id of the action
    // The 2nd, 3th, 4th, 5th values are the mixture values for the engines
    let values: Vec<&str> = values.split(' ').collect();

    // The event id of the first engine = 211 we can add 1 to get the event id of the other engines
    for (index, value) in values.iter().skip(1).enumerate() {
        println!("Mixture value index: {}, {}", index, value);

        connector.transmit_client_event(
            0,
            211 + index as u32,
            map_analog_to_axis(0.0, adc_res as f32, value.parse::<i32>().unwrap()) as DWORD,
            simconnect::SIMCONNECT_GROUP_PRIORITY_HIGHEST,
            simconnect::SIMCONNECT_EVENT_FLAG_GROUPID_IS_PRIORITY,
        );
    }
}

fn propeller_action(connector: &SimConnector, values: String, _modifier: f32, adc_res: i32) {
    // The propeller action is received as a string of 5 values separated by spaces
    // The first value is the Id of the action
    // The 2nd, 3th, 4th, 5th values are the propeller values for the engines
    let values: Vec<&str> = values.split(' ').collect();
    // The event id of the first engine = 215 we can add 1 to get the event id of the other engines
    for (index, value) in values.iter().skip(1).enumerate() {
        connector.transmit_client_event(
            0,
            215 + index as u32,
            map_analog_to_axis(0.0, adc_res as f32, value.parse::<i32>().unwrap()) as DWORD,
            simconnect::SIMCONNECT_GROUP_PRIORITY_HIGHEST,
            simconnect::SIMCONNECT_EVENT_FLAG_GROUPID_IS_PRIORITY,
        );
    }
}

pub fn get_actions() -> HashMap<u32, Action> {
    let mut action_map = HashMap::new();
    action_map.insert(
        199,
        Action::new(199, ActionName::THROTTLE, Box::new(throttle_action)),
    );
    action_map.insert(
        115,
        Action::new(115, ActionName::MIXTURE, Box::new(mixture_action)),
    );
    action_map.insert(
        198,
        Action::new(198, ActionName::PROP, Box::new(propeller_action)),
    );
    action_map
}
