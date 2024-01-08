use crate::simconnect_mod::input_registry::InputRegistry;
use crate::simconnect_mod::output_registry::OutputRegistry;

// #[derive(Debug)]
pub struct SimconnectHandler {
    pub(crate) simconnect: simconnect::SimConnector,
    pub(crate) input_registry: InputRegistry,
    pub(crate) output_registry: OutputRegistry,
    POLLING_INTERVAL: u8,
}

impl SimconnectHandler {
    pub fn new() -> Self {
        let mut simconnect = simconnect::SimConnector::new();
        simconnect.connect("Tauri Simconnect");
        let input_registry = InputRegistry::new();
        let output_registry = OutputRegistry::new();
        Self {
            simconnect,
            input_registry,
            output_registry,
            POLLING_INTERVAL: 6,
        }
    }

    pub fn start_connection(&mut self){
        println!("Starting connection");
        self.initialize_connection();
        loop {
            self.poll_simconnect_message_queue();
            std::thread::sleep(std::time::Duration::from_secs(self.POLLING_INTERVAL as u64));
        }
    }

    pub fn initialize_connection(&mut self){
        println!("Initializing connection");
        self.simconnect.connect("Bits and Droids connector");
        self.input_registry.load_inputs();
        self.output_registry.load_outputs();
        self.input_registry.define_inputs(&mut self.simconnect);
        self.output_registry.define_outputs(&mut self.simconnect);
    }

    pub fn poll_simconnect_message_queue(&mut self){
        println!("Polling simconnect message queue");
    }
}
