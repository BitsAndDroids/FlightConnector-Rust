struct EventRegistry {
    inputs: InputList,
    events: EventList,
}
impl EventRegistry {
    pub fn new() -> EventRegistry {
        EventRegistry {
            inputs: InputList::new(),
            events: EventList::new(),
        }
    }
    pub fn load_inputs(&mut self, path: &str) {
        self.inputs = input_parser::parse_input_json(path);
    }
    pub fn load_events(&mut self, path: &str) {
        self.events = event_parser::parse_event_json(path);
    }
    pub fn get_inputs(&self) -> &InputList {
        &self.inputs
    }
    pub fn get_events(&self) -> &EventList {
        &self.events
    }
    pub fn get_input(&self, input_name: &str) -> Option<&Input> {
        self.inputs.get(input_name)
    }
    pub fn get_event(&self, event_name: &str) -> Option<&Event> {
        self.events.get(event_name)
    }
    pub fn get_input_by_id(&self, input_id: u32) -> Option<&Input> {
        self.inputs.get_by_id(input_id)
    }
    pub fn get_event_by_id(&self, event_id: u32) -> Option<&Event> {
        self.events.get_by_id(event_id)
    }
    pub fn subscribe_to_events(&self, simconnect: &mut SimConnect) {
        for event in self.events.iter() {
            simconnect.subscribe_to_event(event);
        }
    }

}