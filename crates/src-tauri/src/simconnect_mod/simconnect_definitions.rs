use connector_types::types::run_bundle::RunBundle;
use log::warn;
use simconnect::DWORD;

#[cfg(test)]
#[path = "simconnect_definition_tests.rs"]
mod simconnect_definition_tests;

use crate::{
    events::{self, output_registry},
    simconnect_mod::wasm::register_wasm_event,
};

use super::{simconnector::SimConnectorTrait, wasm::send_wasm_command};

struct RequestModes {
    _float: DWORD,
    _string: DWORD,
}

impl RequestModes {
    const FLOAT: DWORD = 0;
    const STRING: DWORD = 1;
}

pub fn add_outputs_to_simconnect_definition(
    conn: &mut dyn SimConnectorTrait,
    output_registry: &mut output_registry::OutputRegistry,
    wasm_registry: &events::wasm_registry::WASMRegistry,
    run_bundles: &Vec<RunBundle>,
) {
    conn.add_data_definition(
        RequestModes::FLOAT,
        "THROTTLE LOWER LIMIT",
        "Percentage",
        simconnect::SIMCONNECT_DATATYPE_SIMCONNECT_DATATYPE_FLOAT64,
        655,
        0.0,
    );

    conn.add_to_client_data_definition(106, 0, 4096, 0.0, 0);

    send_wasm_command(conn, "clear");

    for run_bundle in run_bundles {
        for output in &run_bundle.bundle.outputs {
            match output_registry.get_output_by_id(output.id) {
                Some(latest_output) => {
                    if latest_output.custom {
                        let wasm_event = match wasm_registry.get_wasm_event_by_id(output.id) {
                            Some(wasm_event) => wasm_event.clone(),
                            None => {
                                warn!("Wasm output not found: {:?}", output);
                                return;
                            }
                        };

                        conn.add_to_client_data_definition(
                            wasm_event.id,
                            wasm_event.offset,
                            std::mem::size_of::<f64>() as u32,
                            wasm_event.update_every,
                            0,
                        );
                        register_wasm_event(conn, wasm_event.clone());
                        conn.request_client_data(
                2,
                wasm_event.id,
                wasm_event.id,
                simconnect::SIMCONNECT_CLIENT_DATA_PERIOD_SIMCONNECT_CLIENT_DATA_PERIOD_ON_SET,
                simconnect::SIMCONNECT_CLIENT_DATA_REQUEST_FLAG_CHANGED,
                0,
                0,
                0,
            );
                    }
                    if !latest_output.custom {
                        conn.add_data_definition(
                            RequestModes::FLOAT,
                            &latest_output.simvar,
                            &latest_output.metric,
                            simconnect::SIMCONNECT_DATATYPE_SIMCONNECT_DATATYPE_FLOAT64,
                            latest_output.id,
                            latest_output.update_every,
                        );
                    }
                }
                None => {
                    println!("Output not found: {:?}", output);
                }
            }
        }
    }
}
