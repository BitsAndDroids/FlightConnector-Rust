use std::fs::read_to_string;

use connector_types::types::wasm_event::WasmEvent;

pub fn convert_old_events_to_json(path: &str) {
    let mut wasm_events: Vec<WasmEvent> = Vec::new();
    let result = read_lines(path);
    for line in result.iter() {
        let event = parse_event_line(line);
        wasm_events.push(event);
    }
    let event_file = serde_json::to_string(&wasm_events).unwrap();
    std::fs::write("wasm_module/modules/wasm_events.json", event_file).unwrap();
}

fn read_lines(filename: &str) -> Vec<String> {
    read_to_string(filename)
        .unwrap()
        .lines()
        .map(String::from)
        .collect()
}

fn parse_event_line(line: &str) -> WasmEvent {
    let parts: Vec<&str> = line
        .split(|c| c == '^' || c == '#' || c == '$' || c == '/')
        .collect();
    println!("{:?}", parts);
    let action = parts[0].to_string();
    let type_unformated: &str = parts[1];
    let mut action_type: String = type_unformated.to_string();
    action_type.retain(|c| c.is_numeric());
    let id = parts[2].trim().parse().unwrap();
    let action_text = parts
        .get(5)
        .map_or("", |&s| s.trim_start_matches("//"))
        .to_string();
    println!("{:?}", action_text);
    let update_every = parts[3].trim().parse().unwrap_or(0.0); // Update every value
    println!("{:?}", update_every);
    let min = 0.0;
    let max = 100.0;
    let mut output_format = type_unformated.to_string();
    output_format.retain(|c| c.is_alphabetic());
    output_format = map_output_format(&output_format);

    action_type = map_output_type(&action_type);
    // Create and return a WasmEvent instance
    WasmEvent {
        id,
        action,
        action_text,
        action_type,
        output_format,
        update_every,
        min,
        max,
        offset: 0,
        value: 0.0,
        plane_or_category: vec!["".to_string()],
    }
}

fn map_output_format(output_format: &str) -> String {
    match output_format {
        "i" => "int".to_string(),
        "f" => "float".to_string(),
        "p" => "percent".to_string(),
        "b" => "time".to_string(),
        _ => "".to_string(),
    }
}

fn map_output_type(output_type: &str) -> String {
    match output_type {
        "3" => "output".to_string(),
        "0" => "input".to_string(),
        _ => "".to_string(),
    }
}
