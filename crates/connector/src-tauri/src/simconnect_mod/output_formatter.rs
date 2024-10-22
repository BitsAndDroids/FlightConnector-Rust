use connector_types::types::output::{Output, OutputType};

use crate::sim_utils;

#[cfg(test)]
#[path = "output_formatter_tests.rs"]
mod output_formatter_tests;

pub fn parse_output_based_on_type(val: f64, output: &Output) -> String {
    match output.output_type {
        OutputType::Boolean => sim_utils::output_converters::val_to_bool(val),
        OutputType::Float => val.to_string(),
        OutputType::Float1DecPlaces => sim_utils::output_converters::val_to_dec(val, 1),
        OutputType::Float2DecPlaces => sim_utils::output_converters::val_to_dec(val, 2),
        OutputType::Integer => (val as i32).to_string(),
        OutputType::Seconds => (val as i32).to_string(),
        OutputType::Secondsaftermidnight => sim_utils::output_converters::seconds_to_time(val),
        OutputType::Percentage => ((val * 100.1) as i32).to_string(),
        OutputType::Degrees => sim_utils::output_converters::radian_to_degree(val).to_string(),
        OutputType::ADF => ((val as i32) / 100).to_string(),
        OutputType::INHG => sim_utils::output_converters::value_to_inhg(val).to_string(),
        OutputType::Meterspersecond => sim_utils::output_converters::mps_to_kmh(val).to_string(),
        OutputType::MeterspersecondToKnots => sim_utils::output_converters::mps_to_kts(val),
        OutputType::String => val.to_string(),
    }
}
