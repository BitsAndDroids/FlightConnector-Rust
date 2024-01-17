// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serialport::SerialPort;
//only import if windows
#[cfg(target_os = "windows")]
use simconnect;
#[cfg(target_os = "windows")]
use simconnect::SimConnector;
#[cfg(target_os = "windows")]
use simconnect::DWORD;

use std::io::Read;
use std::string::ToString;
use std::sync::{mpsc, Arc, Mutex};
use std::time::Duration;
use tokio::io::{self};



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
// }

// mod events;
// mod simconnect_mod;
//
// use events::output_parser::output_parser::get_categories_from_file;

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

// fn subscribe_to_events(conn: &mut SimConnector) {
//     let events = Events::new();
//     for event in events.available_events {
//         conn.subscribe_to_system_event(event.1.id, event.1.description);
//     }
// }
//
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

// fn connect_simconnect(rx: mpsc::Receiver<SimCommand>) {
//     let mut conn = SimConnector::new();
//     let events = Events::new();
//     conn.connect("SimConnect Tauri");
//
//     conn.add_data_definition(
//         RequestModes::STRING,
//         "TITLE",
//         "",
//         simconnect::SIMCONNECT_DATATYPE_SIMCONNECT_DATATYPE_STRING256,
//         202,
//         0.0,
//     );
//
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
//
// }

// fn get_output_categories() -> Vec<events::category::Category> {
//     get_categories_from_file("src/events/outputs.json")
// }

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
    /*  let (tx, rx) = mpsc::channel::<SimCommand>();
     *SENDER.lock().unwrap() = Some(tx);*/
    std::thread::spawn(move || {
        //if windows
        #[cfg(target_os = "windows")]
        connect_simconnect(rx);
    });
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            start_com_connection,
            get_com_ports,
            /*send_command*/
        ])
        .setup(|app| Ok(()))
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
