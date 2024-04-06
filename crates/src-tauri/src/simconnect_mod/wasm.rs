use connector_types::types::wasm_event::WasmEvent;
use simconnect::{
    DWORD, SIMCONNECT_CLIENTDATAOFFSET_AUTO, SIMCONNECT_CLIENT_DATA_ID,
    SIMCONNECT_CLIENT_DATA_PERIOD_SIMCONNECT_CLIENT_DATA_PERIOD_SECOND,
    SIMCONNECT_CLIENT_DATA_REQUEST_FLAG_DEFAULT, SIMCONNECT_CREATE_CLIENT_DATA_FLAG_DEFAULT,
    SIMCONNECT_UNUSED,
};

const WASM_DATA_ID: SIMCONNECT_CLIENT_DATA_ID = 1;
const WASM_DEFINITION_ID: u32 = 12;
const REQUEST_ID: u32 = 10;
const DATASIZE: DWORD = 256;

struct client_data_properties {
    id: u32,
    name: &'static str,
    definition_id: u32,
    request_id: u32,
    data_size: DWORD,
    data_array: Vec<u8>,
}

pub fn register_wasm_data(conn: &mut simconnect::SimConnector) {
    let mut input_client = client_data_properties {
        id: 1,
        name: "shared",
        definition_id: 101,
        request_id: 101,
        data_size: 256,
        data_array: vec![0; 256],
    };
    create_wasm_client(conn, &mut input_client);

    let mut output_client = client_data_properties {
        id: 2,
        name: "messages",
        definition_id: 102,
        request_id: 102,
        data_size: 4096,
        data_array: vec![0; 4096],
    };
    create_wasm_client(conn, &mut output_client);
}

fn create_wasm_client(
    conn: &mut simconnect::SimConnector,
    wasm_client_config: &mut client_data_properties,
) {
    conn.map_client_data_name_to_id(wasm_client_config.name, wasm_client_config.id);
    conn.create_client_data(
        wasm_client_config.id,
        wasm_client_config.data_size,
        simconnect::SIMCONNECT_CLIENT_DATA_REQUEST_FLAG_CHANGED,
    );

    conn.add_to_client_data_definition(
        wasm_client_config.definition_id,
        SIMCONNECT_CLIENTDATAOFFSET_AUTO,
        wasm_client_config.data_size,
        0.0,
        SIMCONNECT_UNUSED,
    );
    conn.request_client_data(
        wasm_client_config.id,
        wasm_client_config.request_id,
        wasm_client_config.definition_id,
        SIMCONNECT_CLIENT_DATA_PERIOD_SIMCONNECT_CLIENT_DATA_PERIOD_SECOND,
        SIMCONNECT_CLIENT_DATA_REQUEST_FLAG_DEFAULT,
        0,
        0,
        0,
    );
}

// pub fn register_wasm_data(conn: &mut simconnecto::SimConnector, event: WasmEvent) {
//     //
// }

pub fn send_wasm_data(conn: &mut simconnect::SimConnector, id: u32) {
    unsafe {
        let id_str = format!("{} {}", id, 0);
        let mut data_to_send_array: [u8; 256] = [0; 256];
        let bytes = id_str.as_bytes();
        // Copy id_str bytes into data_to_send_array, leaving space for null termination
        data_to_send_array[..bytes.len()].copy_from_slice(bytes);
        // Ensure null termination
        data_to_send_array[bytes.len()] = b'\0';

        let raw_ptr: *mut std::os::raw::c_void = data_to_send_array.as_mut_ptr() as *mut _;

        // Pass raw_ptr to set_client_data
        conn.set_client_data(
            WASM_DATA_ID,
            WASM_DEFINITION_ID,
            simconnect::SIMCONNECT_CLIENT_DATA_SET_FLAG_DEFAULT,
            0,
            DATASIZE,
            raw_ptr,
        );
    }
}
