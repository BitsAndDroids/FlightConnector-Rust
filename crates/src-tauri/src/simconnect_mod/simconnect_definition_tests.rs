use std::collections::HashMap;

use connector_types::types::{
    bundle::Bundle, output::Output, run_bundle::RunBundle, wasm_event::WasmEvent,
};
use rand::Rng;

#[cfg(test)]
use crate::simconnect_mod::simconnect_definitions;
use crate::{
    events::{self, output_registry},
    simconnect_mod::simconnector::MockSimConnector,
};

fn get_random_wasm_event(nr: usize) -> HashMap<u32, WasmEvent> {
    let mut rng = rand::thread_rng();
    let mut ids: Vec<u32> = Vec::new();
    for _ in 0..nr {
        ids.push(rng.gen_range(100..200))
    }
    let mut wasm_events: HashMap<u32, WasmEvent> = HashMap::new();
    for id in ids {
        let wasm_event = WasmEvent {
            id,
            action: "test".to_string(),
            action_text: "test".to_string(),
            action_type: "test".to_string(),
            output_format: "test".to_string(),
            update_every: 1.0,
            value: 0.0,
            min: 0.0,
            max: 0.0,
            offset: 0,
            plane_or_category: "".to_string(),
        };
        wasm_events.insert(id, wasm_event);
    }
    wasm_events
}

fn get_random_output(nr: usize) -> HashMap<u32, Output> {
    let mut rng = rand::thread_rng();
    let mut ids: Vec<u32> = Vec::new();
    for _ in 0..nr {
        ids.push(rng.gen_range(1..100))
    }
    let mut outputs: HashMap<u32, Output> = HashMap::new();
    for id in ids {
        let output = Output {
            simvar: "test".to_string(),
            metric: "test".to_string(),
            update_every: 1.0,
            cb_text: "test".to_string(),
            id,
            category: "test".to_string(),
            output_type: connector_types::types::output::OutputType::Float,
            value: 0.0,
            custom: false,
        };
        outputs.insert(id, output);
    }
    outputs
}

#[test]
fn register_all_output_events_to_simconnect() {
    let mut mock_connector = MockSimConnector::new();
    let mut output_registry = output_registry::OutputRegistry::new();
    let wasm_registry = events::wasm_registry::WASMRegistry::new();
    let mut run_bundles: Vec<RunBundle> = Vec::new();
    let mut bundle: Bundle = Bundle {
        name: "test".to_string(),
        version: 0,
        outputs: Vec::new(),
    };
    output_registry.outputs = get_random_output(10);
    for output in output_registry.outputs.values() {
        bundle.outputs.push(output.clone());
    }
    run_bundles.push(RunBundle {
        id: 1,
        com_port: "test".to_string(),
        bundle,
    });
    simconnect_definitions::add_outputs_to_simconnect_definition(
        &mut mock_connector,
        &mut output_registry,
        &wasm_registry,
        &run_bundles,
    );
    let data_definition = mock_connector.get_data_definition();
    // +1 for the definition of the THROTTLE LOWER LIMIT (655)
    assert_eq!(data_definition.len(), output_registry.outputs.len() + 1);
    assert_eq!(data_definition[0], 655);
}

#[test]
fn register_all_output_and_wasm_events_to_simconnect() {
    let elements: usize = 10;
    let mut mock_connector = MockSimConnector::new();
    let mut output_registry = output_registry::OutputRegistry::new();
    let mut wasm_registry = events::wasm_registry::WASMRegistry::new();
    let mut run_bundles: Vec<RunBundle> = Vec::new();
    let mut bundle: Bundle = Bundle {
        name: "test".to_string(),
        version: 0,
        outputs: Vec::new(),
    };
    output_registry.outputs = get_random_output(elements);
    let wasm_events = get_random_wasm_event(elements);
    output_registry.add_wasm_outputs(&wasm_events);
    wasm_registry.set_wasm_outputs(wasm_events.clone());
    for output in output_registry.outputs.values() {
        bundle.outputs.push(output.clone());
    }

    run_bundles.push(RunBundle {
        id: 1,
        com_port: "test".to_string(),
        bundle,
    });

    simconnect_definitions::add_outputs_to_simconnect_definition(
        &mut mock_connector,
        &mut output_registry,
        &wasm_registry,
        &run_bundles,
    );

    let client_data_definition = mock_connector.get_client_data_definition();
    let data_definition = mock_connector.get_data_definition();
    assert_eq!(
        client_data_definition.len(),
        wasm_events.len() + 1,
        "client_data_definition length is not equal"
    );
    assert_eq!(
        data_definition.len(),
        elements + 1,
        "data definition length is not equal"
    );
    assert_eq!(data_definition[0], 655, "655 is not pressent");
}
