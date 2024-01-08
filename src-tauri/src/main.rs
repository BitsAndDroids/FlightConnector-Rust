// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use mpsc::channel;
use serialport::SerialPort;
use simconnect;
use simconnect::{SimConnector};
use simconnect::DWORD;
use std::collections::HashMap;
use std::io::Read;
use std::string::ToString;
use std::thread::sleep;
use std::time::Duration;
use tauri::Manager;
use tokio::io::{self};
use std::sync::{Arc, mpsc, Mutex};
use lazy_static::lazy_static;

const MAX_RETURNED_ITEMS: usize = 255;

lazy_static! {
    static ref SENDER: Arc<Mutex<Option<mpsc::Sender<SimCommand>>>> = Arc::new(Mutex::new(None));
}

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

#[derive(Clone)]
struct Event {
    id: DWORD,
    description: &'static str,
}

struct Events {
    available_events: HashMap<DWORD, Event>,
    sim_start: Event,
}

impl Events {
    fn new() -> Self {
        let mut available_events: HashMap<DWORD, Event> = HashMap::new();
        let sim_start: Event = Event {
            id: 0,
            description: "SimStart",
        };

        available_events.insert(0, sim_start.clone());

        Self {
            available_events,
            sim_start,
        }
        }
}

#[repr(C, packed)]
struct DataStruct {
    id: DWORD,
    value: f64,
}

struct StringStruct {
    id: DWORD,
    //string 256
    value: [u8; MAX_RETURNED_ITEMS],
}

struct DataStructContainer {
    data: [DataStruct; MAX_RETURNED_ITEMS],
}

mod events;
mod simconnect_mod;

use events::output_parser::output_parser::get_categories_from_file;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

#[tauri::command]
fn start_com_connection(app: tauri::AppHandle, port: String) {
    let ports = serialport::available_ports().expect("No ports found!");
    let ports_output = ports
        .iter()
        .map(|port| port.port_name.as_str())
        .collect::<Vec<_>>()
        .join(", ");
    println!("Available ports are: {}", ports_output);
    std::thread::spawn(move || {
        tokio::runtime::Builder::new_current_thread()
            .enable_all()
            .build()
            .unwrap()
            .block_on(poll_com_port(app, port))
    });
}

// define the payload struct
#[derive(Clone, serde::Serialize)]
struct Payload {
    message: String,
}

#[tauri::command]
async fn get_com_ports() -> Vec<String> {
    let ports = serialport::available_ports().expect("No ports found!");
    let ports_output = ports
        .iter()
        .map(|port| port.port_name.as_str())
        .map(|port| port.to_string())
        .collect::<Vec<_>>();
    ports_output
}


async fn poll_com_port(app: tauri::AppHandle, port: String) {
    println!("Polling COM port");
    let mut port = serialport::new(port, 115200)
        .timeout(std::time::Duration::from_millis(7000))
        .open()
        .expect("Failed to open port");
    let mut buffer: Vec<u8> = Vec::new();
    loop {
        let mut byte = [0u8; 1];
        match port.read(&mut byte) {
            Ok(_) => {
                if byte[0] == b'\n' {
                    let message = String::from_utf8_lossy(&buffer);
                    println!("Read message from serial port: {}", message);
                    buffer.clear();
                } else {
                    buffer.push(byte[0]);
                }
            }
            Err(ref e) if e.kind() == io::ErrorKind::TimedOut => (),
            Err(e) => eprintln!("{:?}", e),
        }
        tokio::time::sleep(Duration::from_micros(10)).await;
    }
}


fn subscribe_to_events(conn: &mut SimConnector) {
    let events = Events::new();
    for event in events.available_events {
        conn.subscribe_to_system_event(event.1.id, event.1.description);
    }
}

#[tauri::command]
fn send_command(app: tauri::AppHandle, command: i16) {
    println!("Command: {}", command);
    let sender = SENDER
        .lock()
        .unwrap()
        .as_ref()
        .expect("SimConnect not initialized")
        .clone();
    sender.send(SimCommand::NewCommand(command)).unwrap();
}

fn connect_simconnect(rx: mpsc::Receiver<SimCommand>) {
    let mut conn = simconnect::SimConnector::new();
    let events = Events::new();
    conn.connect("SimConnect Tauri");

    conn.add_data_definition(
        RequestModes::STRING,
        "TITLE",
        "",
        simconnect::SIMCONNECT_DATATYPE_SIMCONNECT_DATATYPE_STRING256,
        202,
        0.0,
    );

    let mut input_registry = simconnect_mod::input_registry::InputRegistry::new();
    input_registry.load_inputs();
    input_registry.define_inputs(&mut conn);

    let mut output_registry = simconnect_mod::output_registry::OutputRegistry::new();
    output_registry.load_outputs();
    output_registry.define_outputs(&mut conn);

    subscribe_to_events(&mut conn);

    conn.request_data_on_sim_object(
        0,
        RequestModes::FLOAT,
        0,
        simconnect::SIMCONNECT_PERIOD_SIMCONNECT_PERIOD_SIM_FRAME,
        simconnect::SIMCONNECT_CLIENT_DATA_REQUEST_FLAG_CHANGED
            | simconnect::SIMCONNECT_CLIENT_DATA_REQUEST_FLAG_TAGGED,
        0,
        1,
        0,
    );
    conn.request_data_on_sim_object(
        1,
        RequestModes::STRING,
        0,
        simconnect::SIMCONNECT_PERIOD_SIMCONNECT_PERIOD_SIM_FRAME,
        simconnect::SIMCONNECT_CLIENT_DATA_REQUEST_FLAG_CHANGED
            | simconnect::SIMCONNECT_CLIENT_DATA_REQUEST_FLAG_TAGGED,
        0,
        1,
        0,
    );

    loop {
        match rx.try_recv(){
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
                let sim_data_value = unsafe { std::ptr::read_unaligned(sim_data_ptr).to_string() };
                println!(
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

fn get_output_categories() -> Vec<events::category::Category> {
    get_categories_from_file("src/events/outputs.json")
}

fn poll_microcontroller_for_inputs() {
    let mut port = serialport::new("COM3", 115200)
        .timeout(std::time::Duration::from_millis(7000))
        .open()
        .expect("Failed to open port");
    let mut buffer: Vec<u8> = Vec::new();
    loop {
        let mut byte = [0u8; 1];
        match port.read(&mut byte) {
            Ok(_) => {
                if byte[0] == b'\n' {
                    let message = String::from_utf8_lossy(&buffer);
                    println!("Read message from serial port: {}", message);
                    buffer.clear();
                } else {
                    buffer.push(byte[0]);
                }
            }
            Err(ref e) if e.kind() == io::ErrorKind::TimedOut => (),
            Err(e) => eprintln!("{:?}", e),
        }
        std::thread::sleep(std::time::Duration::from_micros(10));
    }
}

fn main() {
    let (tx, rx) = mpsc::channel::<SimCommand>();
    *SENDER.lock().unwrap() = Some(tx);
    std::thread::spawn(move || {
        connect_simconnect(rx);
    });
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            start_com_connection,
            get_com_ports,
            send_command
        ])
        .setup(|app| {

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
