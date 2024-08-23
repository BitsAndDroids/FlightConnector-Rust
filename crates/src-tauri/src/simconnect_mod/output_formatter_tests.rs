use connector_types::types::output::Output;

#[cfg(test)]
use crate::simconnect_mod::output_formatter;

#[test]
fn test_parse_output_percentages() {
    let percentage_output = Output {
        simvar: "percentage".to_string(),
        metric: "percentage".to_string(),
        update_every: 1.0,
        cb_text: "percentage".to_string(),
        id: 1,
        category: "percentage".to_string(),
        output_type: connector_types::types::output::OutputType::Percentage,
        value: 0.0,
    };

    let val = 0.5;
    let result = output_formatter::parse_output_based_on_type(val, &percentage_output);
    assert_eq!(result, "50");
}

#[test]
fn test_seconds_after_midnight_to_hours() {
    let seconds_after_midnight_output = Output {
        simvar: "seconds_after_midnight".to_string(),
        metric: "SecondsAfterMidnight".to_string(),
        update_every: 1.0,
        cb_text: "seconds_after_midnight".to_string(),
        id: 1,
        category: "seconds_after_midnight".to_string(),
        output_type: connector_types::types::output::OutputType::Secondsaftermidnight,
        value: 0.0,
    };

    let val = 3600.0;
    let result = output_formatter::parse_output_based_on_type(val, &seconds_after_midnight_output);
    assert_eq!(result, "01:00:00");
}

#[test]
fn test_radians_to_degrees() {
    let degrees_output = Output {
        simvar: "degrees".to_string(),
        metric: "degrees".to_string(),
        update_every: 1.0,
        cb_text: "degrees".to_string(),
        id: 1,
        category: "degrees".to_string(),
        output_type: connector_types::types::output::OutputType::Degrees,
        value: 0.0,
    };

    let val = std::f64::consts::PI;
    let result = output_formatter::parse_output_based_on_type(val, &degrees_output);
    assert_eq!(result, "180");
}

#[test]
fn test_val_to_inhg() {
    let inhg_output = Output {
        simvar: "inhg".to_string(),
        metric: "inhg".to_string(),
        update_every: 1.0,
        cb_text: "inhg".to_string(),
        id: 1,
        category: "inhg".to_string(),
        output_type: connector_types::types::output::OutputType::INHG,
        value: 0.0,
    };

    let val = 29.92;
    let result = output_formatter::parse_output_based_on_type(val, &inhg_output);
    assert_eq!(result, "2992");
}

#[test]
fn test_val_to_adf() {
    let adf_output = Output {
        simvar: "adf".to_string(),
        metric: "adf".to_string(),
        update_every: 1.0,
        cb_text: "adf".to_string(),
        id: 1,
        category: "adf".to_string(),
        value: 0.0,
        output_type: connector_types::types::output::OutputType::ADF,
    };

    let val = 113000.0;
    let result = output_formatter::parse_output_based_on_type(val, &adf_output);
    assert_eq!(result, "1130");
}

#[test]
fn test_mps_to_kmh() {
    let mps_output = Output {
        simvar: "mps".to_string(),
        metric: "mps".to_string(),
        update_every: 1.0,
        cb_text: "mps".to_string(),
        id: 1,
        category: "mps".to_string(),
        output_type: connector_types::types::output::OutputType::Meterspersecond,
        value: 0.0,
    };

    let val = 1.0;
    let result = output_formatter::parse_output_based_on_type(val, &mps_output);
    assert_eq!(result, "3.6");
}

#[test]
fn test_val_to_bool() {
    let bool_output = Output {
        simvar: "bool".to_string(),
        metric: "bool".to_string(),
        update_every: 1.0,
        cb_text: "bool".to_string(),
        id: 1,
        category: "bool".to_string(),
        value: 0.0,
        output_type: connector_types::types::output::OutputType::Boolean,
    };
    let val = 0.5;
    let result = output_formatter::parse_output_based_on_type(val, &bool_output);
    assert_eq!(result, "0");
    let val = 1.0;
    let result = output_formatter::parse_output_based_on_type(val, &bool_output);
    assert_eq!(result, "1");
}

#[test]
fn test_val_to_integer() {
    let int_output = Output {
        simvar: "int".to_string(),
        metric: "int".to_string(),
        update_every: 1.0,
        cb_text: "int".to_string(),
        id: 1,
        category: "int".to_string(),
        output_type: connector_types::types::output::OutputType::Integer,
        value: 0.0,
    };

    let val = 1.0;
    let result = output_formatter::parse_output_based_on_type(val, &int_output);
    assert_eq!(result, "1");
}

#[test]
fn test_val_to_seconds() {
    let seconds_output = Output {
        simvar: "seconds".to_string(),
        metric: "seconds".to_string(),
        update_every: 1.0,
        cb_text: "seconds".to_string(),
        id: 1,
        category: "seconds".to_string(),
        output_type: connector_types::types::output::OutputType::Seconds,
        value: 0.0,
    };

    let val = 1.0;
    let result = output_formatter::parse_output_based_on_type(val, &seconds_output);
    assert_eq!(result, "1");
}
