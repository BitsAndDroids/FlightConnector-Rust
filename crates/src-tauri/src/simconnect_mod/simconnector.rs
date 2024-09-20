use std::cell::RefCell;

use simconnect::{
    DWORD, SIMCONNECT_CLIENT_DATA_ID, SIMCONNECT_CLIENT_DATA_PERIOD,
    SIMCONNECT_CLIENT_DATA_REQUEST_FLAG, SIMCONNECT_DATATYPE, SIMCONNECT_DATA_DEFINITION_ID,
    SIMCONNECT_DATA_REQUEST_ID,
};

pub trait SimConnectorTrait {
    fn add_data_definition(
        &self,
        define_id: SIMCONNECT_DATA_DEFINITION_ID,
        datum_name: &str,
        units_name: &str,
        datum_type: SIMCONNECT_DATATYPE,
        datum_id: DWORD,
        epsilon: f32,
    ) -> bool;
    fn add_to_client_data_definition(
        &self,
        define_id: SIMCONNECT_DATA_DEFINITION_ID,
        offset: DWORD,
        size_or_type: DWORD,
        epsilon: f32,
        datum_id: DWORD,
    ) -> bool;
    fn map_client_data_name_to_id(&self, name: &str, id: SIMCONNECT_CLIENT_DATA_ID) -> bool;
    #[allow(clippy::too_many_arguments)]
    fn request_client_data(
        &self,
        data_id: SIMCONNECT_CLIENT_DATA_ID,
        request_id: SIMCONNECT_DATA_REQUEST_ID,
        define_id: SIMCONNECT_DATA_DEFINITION_ID,
        period: SIMCONNECT_CLIENT_DATA_PERIOD,
        flags: SIMCONNECT_CLIENT_DATA_REQUEST_FLAG,
        origin: DWORD,
        interval: DWORD,
        limit: DWORD,
    ) -> bool;
    fn set_client_data(
        &self,
        data_id: SIMCONNECT_CLIENT_DATA_ID,
        define_id: SIMCONNECT_DATA_DEFINITION_ID,
        flags: DWORD,
        reserved: DWORD,
        unit_size: DWORD,
        data_set: *mut std::os::raw::c_void,
    ) -> bool;
}

impl SimConnectorTrait for simconnect::SimConnector {
    fn add_data_definition(
        &self,
        define_id: SIMCONNECT_DATA_DEFINITION_ID,
        datum_name: &str,
        units_name: &str,
        datum_type: SIMCONNECT_DATATYPE,
        datum_id: DWORD,
        epsilon: f32,
    ) -> bool {
        self.add_data_definition(
            define_id, datum_name, units_name, datum_type, datum_id, epsilon,
        )
    }
    fn add_to_client_data_definition(
        &self,
        define_id: SIMCONNECT_DATA_DEFINITION_ID,
        offset: DWORD,
        size_or_type: DWORD,
        epsilon: f32,
        datum_id: DWORD,
    ) -> bool {
        self.add_to_client_data_definition(define_id, offset, size_or_type, epsilon, datum_id)
    }
    fn map_client_data_name_to_id(&self, name: &str, id: SIMCONNECT_CLIENT_DATA_ID) -> bool {
        self.map_client_data_name_to_id(name, id)
    }
    fn request_client_data(
        &self,
        data_id: SIMCONNECT_CLIENT_DATA_ID,
        request_id: SIMCONNECT_DATA_REQUEST_ID,
        define_id: SIMCONNECT_DATA_DEFINITION_ID,
        period: SIMCONNECT_CLIENT_DATA_PERIOD,
        flags: SIMCONNECT_CLIENT_DATA_REQUEST_FLAG,
        origin: DWORD,
        interval: DWORD,
        limit: DWORD,
    ) -> bool {
        self.request_client_data(
            data_id, request_id, define_id, period, flags, origin, interval, limit,
        )
    }

    fn set_client_data(
        &self,
        data_id: SIMCONNECT_CLIENT_DATA_ID,
        define_id: SIMCONNECT_DATA_DEFINITION_ID,
        flags: DWORD,
        reserved: DWORD,
        unit_size: DWORD,
        data_set: *mut std::os::raw::c_void,
    ) -> bool {
        unsafe { self.set_client_data(data_id, define_id, flags, reserved, unit_size, data_set) }
    }
}

#[derive(Default)]
pub struct MockSimConnector {
    client_data_definition: RefCell<Vec<SIMCONNECT_DATA_DEFINITION_ID>>,
    data_definition: RefCell<Vec<SIMCONNECT_DATA_DEFINITION_ID>>,
}

impl MockSimConnector {
    pub fn new() -> Self {
        Self {
            client_data_definition: RefCell::new(Vec::new()),
            data_definition: RefCell::new(Vec::new()),
        }
    }

    pub fn get_client_data_definition(&self) -> Vec<SIMCONNECT_DATA_DEFINITION_ID> {
        self.client_data_definition.borrow().clone()
    }

    pub fn get_data_definition(&self) -> Vec<SIMCONNECT_DATA_DEFINITION_ID> {
        self.data_definition.borrow().clone()
    }
}

impl SimConnectorTrait for MockSimConnector {
    fn add_data_definition(
        &self,
        _define_id: SIMCONNECT_DATA_DEFINITION_ID,
        _datum_name: &str,
        _units_name: &str,
        _datum_type: SIMCONNECT_DATATYPE,
        datum_id: DWORD,
        epsilon: f32,
    ) -> bool {
        (*self.data_definition.borrow_mut()).push(datum_id);
        true
    }

    fn add_to_client_data_definition(
        &self,
        define_id: SIMCONNECT_DATA_DEFINITION_ID,
        _offset: DWORD,
        _size_or_type: DWORD,
        _epsilon: f32,
        _datum_id: DWORD,
    ) -> bool {
        (*self.client_data_definition.borrow_mut()).push(define_id);
        true
    }

    fn map_client_data_name_to_id(&self, name: &str, id: SIMCONNECT_CLIENT_DATA_ID) -> bool {
        true
    }

    fn request_client_data(
        &self,
        _data_id: SIMCONNECT_CLIENT_DATA_ID,
        _request_id: SIMCONNECT_DATA_REQUEST_ID,
        _define_id: SIMCONNECT_DATA_DEFINITION_ID,
        _period: SIMCONNECT_CLIENT_DATA_PERIOD,
        _flags: SIMCONNECT_CLIENT_DATA_REQUEST_FLAG,
        _origin: DWORD,
        _interval: DWORD,
        _limit: DWORD,
    ) -> bool {
        true
    }

    fn set_client_data(
        &self,
        _data_id: SIMCONNECT_CLIENT_DATA_ID,
        _define_id: SIMCONNECT_DATA_DEFINITION_ID,
        _flags: DWORD,
        _reserved: DWORD,
        _unit_size: DWORD,
        _data_set: *mut std::os::raw::c_void,
    ) -> bool {
        true
    }
}
