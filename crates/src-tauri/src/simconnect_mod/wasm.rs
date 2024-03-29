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
pub fn register_wasm_data(conn: &mut simconnect::SimConnector) {
    conn.map_client_data_name_to_id("shared", WASM_DATA_ID);
    conn.create_client_data(
        WASM_DATA_ID,
        DATASIZE,
        simconnect::SIMCONNECT_CLIENT_DATA_REQUEST_FLAG_CHANGED,
    );
    let mut data_to_send_array: [u8; 256] = [0; 256];
    let id = "1000";
    let id = id.as_bytes();
    (0..id.len()).for_each(|i| {
        data_to_send_array[i] = id[i];
    });
    let raw_ptr: *mut std::os::raw::c_void =
        &mut data_to_send_array as *mut _ as *mut std::os::raw::c_void;
    conn.add_to_client_data_definition(
        WASM_DEFINITION_ID,
        SIMCONNECT_CLIENTDATAOFFSET_AUTO,
        DATASIZE,
        0.0,
        SIMCONNECT_UNUSED,
    );
    conn.request_client_data(
        WASM_DATA_ID,
        REQUEST_ID,
        WASM_DEFINITION_ID,
        SIMCONNECT_CLIENT_DATA_PERIOD_SIMCONNECT_CLIENT_DATA_PERIOD_SECOND,
        SIMCONNECT_CLIENT_DATA_REQUEST_FLAG_DEFAULT,
        0,
        0,
        0,
    );
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
            simconnect::SIMCONNECT_CLIENT_DATA_SET_FLAG_DEFAULT,
            0,
            DATASIZE,
            raw_ptr,
        );
    }
}
