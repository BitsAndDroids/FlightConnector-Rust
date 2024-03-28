#[cfg(test)]
use crate::parsers::output_parser;

#[test]
fn test_parse_output() {
    let outputs = output_parser::get_outputs_from_file("src/events/outputs.json");
    assert!(!outputs.is_empty());
}
