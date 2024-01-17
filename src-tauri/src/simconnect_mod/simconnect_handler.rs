use crate::events::input_registry::InputRegistry;
use crate::events::output_registry::OutputRegistry;

const MAX_RETURNED_ITEMS: usize = 255;

lazy_static! {
    static ref SENDER: Arc<Mutex<Option<mpsc::Sender<SimCommand>>>> = Arc::new(Mutex::new(None));
}

#[derive(Clone)]
struct Event {
    id: DWORD,
    description: &'static str,
}

struct Events {
    available_events: HashMap<DWORD, Event>,
    sim_start: Event,
}

// impl Events {
//     fn new() -> Self {
//         let mut available_events: HashMap<DWORD, Event> = HashMap::new();
//         let sim_start: Event = Event {
//             id: 0,
//             description: "SimStart",
//         };
//
//         available_events.insert(0, sim_start.clone());
//
//         Self {
//             available_events,
//             sim_start,
//         }
//         }
// }

//
// #[repr(C, packed)]
// struct DataStruct {
//     id: DWORD,
//     value: f64,
// }
//
// struct StringStruct {
//     id: DWORD,
//     //string 256
//     value: [u8; MAX_RETURNED_ITEMS],
// }

// struct DataStructContainer {
//     data: [DataStruct; MAX_RETURNED_ITEMS],
//}

enum SimCommand {
    NewCommand(i16),
}

struct RequestModes {
    float: DWORD,
    string: DWORD,
}

impl RequestModes {
    const FLOAT: DWORD = 0;
    const STRING: DWORD = 1;
}

#[derive(Debug)]
pub struct SimconnectHandler {
    pub(crate) simconnect: simconnect::SimConnector,
    pub(crate) input_registry: InputRegistry,
    pub(crate) output_registry: OutputRegistry,
    POLLING_INTERVAL: u8,
}

// define the payload struct
#[derive(Clone, serde::Serialize)]
struct Payload {
    message: String,
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

    pub fn start_connection(&mut self) {
        println!("Starting connection");
        self.initialize_connection();
        loop {
            self.poll_simconnect_message_queue();
            std::thread::sleep(std::time::Duration::from_secs(self.POLLING_INTERVAL as u64));
        }
    }

    // #[tauri::command]
// fn send_command(app: tauri::AppHandle, command: i16) {
//     println!("Command: {}", command);
//     let sender = SENDER
//         .lock()
//         .unwrap()
//         .as_ref()
//         .expect("SimConnect not initialized")
//         .clone();
//     sender.send(SimCommand::NewCommand(command)).unwrap();
// }

    pub fn initialize_connection(&mut self) {
        println!("Initializing connection");
        self.simconnect.connect("Bits and Droids connector");
        self.input_registry.load_inputs();
        self.output_registry.load_outputs();
        self.input_registry.define_inputs(&mut self.simconnect);
        self.output_registry.define_outputs(&mut self.simconnect);
    }

    fn poll_simconnect_message_queue(&mut self) {
        //     conn.add_data_definition(
//         RequestModes::STRING,
//         "TITLE",
//         "",
//         simconnect::SIMCONNECT_DATATYPE_SIMCONNECT_DATATYPE_STRING256,
//         202,
//         0.0,
//     );
//     conn.request_data_on_sim_object(
//         0,
//         RequestModes::FLOAT,
//         0,
//         simconnect::SIMCONNECT_PERIOD_SIMCONNECT_PERIOD_SIM_FRAME,
//         simconnect::SIMCONNECT_CLIENT_DATA_REQUEST_FLAG_CHANGED
//             | simconnect::SIMCONNECT_CLIENT_DATA_REQUEST_FLAG_TAGGED,
//         0,
//         1,
//         0,
//     );
//     conn.request_data_on_sim_object(
//         1,
//         RequestModes::STRING,
//         0,
//         simconnect::SIMCONNECT_PERIOD_SIMCONNECT_PERIOD_SIM_FRAME,
//         simconnect::SIMCONNECT_CLIENT_DATA_REQUEST_FLAG_CHANGED
//             | simconnect::SIMCONNECT_CLIENT_DATA_REQUEST_FLAG_TAGGED,
//         0,
//         1,
//         0,
//     );
        loop {
            match rx.try_recv() {
                Ok(SimCommand::NewCommand(command)) => {
                    println!("Command in thread: {}", command);
                    conn.transmit_client_event(
                        0,
                        command as u32,
                        0,
                        simconnect::SIMCONNECT_GROUP_PRIORITY_HIGHEST,
                        simconnect::SIMCONNECT_EVENT_FLAG_GROUPID_IS_PRIORITY,
                    );
                }
                Err(mpsc::TryRecvError::Empty) => (),
                Err(mpsc::TryRecvError::Disconnected) => {
                    println!("Disconnected");
                    break;
                }
            }
            match conn.get_next_message() {
                Ok(simconnect::DispatchResult::SimObjectData(data)) => {
                    match data.dwDefineID {
                        RequestModes::FLOAT => {
                            unsafe {
                                let sim_data_ptr =
                                    std::ptr::addr_of!(data.dwData) as *const DataStructContainer;
                                let sim_data_value = std::ptr::read_unaligned(sim_data_ptr);
                                let count = data.dwDefineCount as usize;
                                println!("{}", count);
                                // itterate through the array of data structs
                                for i in 0..count {
                                    let value = sim_data_value.data[i].value;
                                    let prefix = sim_data_value.data[i].id;
                                    println!("{}", prefix.to_string());
                                    println!("{}", value);
                                }
                            }
                        }
                        RequestModes::STRING => {
                            unsafe {
                                println!("2 strings");
                                let sim_data_ptr =
                                    std::ptr::addr_of!(data.dwData) as *const StringStruct;
                                let sim_data_value = std::ptr::read_unaligned(sim_data_ptr);
                                //byte array to string
                                let string = std::str::from_utf8(&sim_data_value.value).unwrap();
                                println!("{}", string);
                            }
                        }
                        0 => {
                            println!("1");
                        }
                        _ => ()
                    }
                }
                Ok(simconnect::DispatchResult::Event(data)) => {
                    // handle Event variant ...
                    let sim_data_ptr = std::ptr::addr_of!(data.dwData) as *const DWORD;
                    println!(
                    let sim_data_value = unsafe { std::ptr::read_unaligned(sim_data_ptr).to_string() };
                        "EVENT {}",
                        events
                            .available_events
                            .get(&sim_data_value.parse::<DWORD>().unwrap())
                            .unwrap()
                            .description
                    );
                }
                _ => (),
            }
            sleep(Duration::from_millis(16));
        }
    }

    /*pub fn define_inputs(&self, conn: &mut simconnect::SimConnector){
       for input in &self.inputs {
           conn.map_client_event_to_sim_event(
               input.0.clone() as SIMCONNECT_CLIENT_EVENT_ID,
               input.1.event.as_str(),
           );
       }
   }*/
    /*  pub fn define_outputs(&self, conn: &mut simconnect::SimConnector) {
       for output in &self.outputs {
           conn.add_data_definition(
               RequestModes::FLOAT,
               &*output.output_name,
               &*output.metric,
               simconnect::SIMCONNECT_DATATYPE_SIMCONNECT_DATATYPE_FLOAT64,
               output.id,
               output.update_every,
           );
           println!("Output: {:?}", output);
       }
   }*/
}
