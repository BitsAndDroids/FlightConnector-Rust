use connector_types::types::wasm_event::WasmEvent;
use simconnect::{
    DWORD, SIMCONNECT_CLIENTDATAOFFSET_AUTO, SIMCONNECT_CLIENT_DATA_ID,
    SIMCONNECT_CLIENT_DATA_SET_FLAG_DEFAULT, SIMCONNECT_CREATE_CLIENT_DATA_FLAG_DEFAULT,
    SIMCONNECT_UNUSED,
};

const WASM_DATA_ID: SIMCONNECT_CLIENT_DATA_ID = 1;
const WASM_DEFINITION_ID: u32 = 101;
const DATASIZE: DWORD = 256;

struct ClientDataProperties {
    id: u32,
    name: &'static str,
    definition_id: u32,
    request_id: u32,
    data_size: DWORD,
}

pub fn register_wasm_data(conn: &mut simconnect::SimConnector) {
    let mut input_client = ClientDataProperties {
        id: 1,
        name: "shared",
        definition_id: 101,
        request_id: 102,
        data_size: 256,
    };
    create_wasm_client(conn, &mut input_client);

    let mut output_client = ClientDataProperties {
        id: 2,
        name: "messages",
        definition_id: 103,
        request_id: 104,
        data_size: 4096,
    };
    create_wasm_client(conn, &mut output_client);

    let mut command_client = ClientDataProperties {
        id: 3,
        name: "command_client",
        definition_id: 105,
        request_id: 106,
        data_size: 4096,
    };
    create_wasm_client(conn, &mut command_client);
}

fn create_wasm_client(
    conn: &mut simconnect::SimConnector,
    wasm_client_config: &mut ClientDataProperties,
) {
    conn.map_client_data_name_to_id(
        wasm_client_config.name,
        wasm_client_config.id as SIMCONNECT_CLIENT_DATA_ID,
    );
    conn.create_client_data(
        wasm_client_config.id as SIMCONNECT_CLIENT_DATA_ID,
        wasm_client_config.data_size,
        SIMCONNECT_CREATE_CLIENT_DATA_FLAG_DEFAULT,
    );
    if wasm_client_config.name == "shared" {
        conn.add_to_client_data_definition(
            wasm_client_config.definition_id,
            SIMCONNECT_CLIENTDATAOFFSET_AUTO,
            wasm_client_config.data_size,
            0.0,
            SIMCONNECT_UNUSED,
        );
    }
}

pub fn register_wasm_event(conn: &mut simconnect::SimConnector, event: WasmEvent) {
    let event_json = serde_json::to_string(&event).unwrap();
    send_wasm_command(conn, event_json.as_str());
}

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
            SIMCONNECT_CLIENT_DATA_SET_FLAG_DEFAULT,
            0,
            DATASIZE,
            raw_ptr,
        );
    }
}
pub fn send_wasm_command(conn: &mut simconnect::SimConnector, command: &str) {
    unsafe {
        let mut data_to_send_array: [u8; 4096] = [0; 4096];
        let bytes = command.as_bytes();
        // Copy id_str bytes into data_to_send_array, leaving space for null termination
        data_to_send_array[..bytes.len()].copy_from_slice(bytes);
        // Ensure null termination
        data_to_send_array[bytes.len()] = b'\0';

        let raw_ptr: *mut std::os::raw::c_void = data_to_send_array.as_mut_ptr() as *mut _;

        // Pass raw_ptr to set_client_data
        conn.set_client_data(
            3 as SIMCONNECT_CLIENT_DATA_ID,
            106,
            SIMCONNECT_CLIENT_DATA_SET_FLAG_DEFAULT,
            0,
            4096,
            raw_ptr,
        );
    }
}
