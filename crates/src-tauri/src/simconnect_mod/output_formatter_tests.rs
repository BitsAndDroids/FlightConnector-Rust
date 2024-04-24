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
    };

    let val = 0.5;
    let result = output_formatter::parse_output_based_on_type(val, &percentage_output);
    assert_eq!(result, "50");
}
