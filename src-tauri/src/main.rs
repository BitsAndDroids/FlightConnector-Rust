// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serialport::SerialPort;
use simconnect;
use simconnect::SimConnector;
use simconnect::DWORD;
use std::collections::HashMap;
use std::io::Read;
use std::string::ToString;
use std::thread::sleep;
use std::time::Duration;
use tauri::Manager;
use tokio::io::{self};

const MAX_RETURNED_ITEMS: usize = 255;

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

use events::output_parser::output_parser::parse_json;

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

async fn test_app_handle(app: tauri::AppHandle, message: String) {
    app.emit_all(
        "event-name",
        Payload {
            message: format!("{}", message),
        },
    )
    .unwrap();
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
                    send_message_to_js(app.clone(), &message).await;
                    buffer.clear();
                } else {
                    buffer.push(byte[0]);
                }
            }
            Err(ref e) if e.kind() == io::ErrorKind::TimedOut => (),
            Err(e) => eprintln!("{:?}", e),
        }
        tokio::time::sleep(std::time::Duration::from_micros(10)).await;
    }
}

async fn send_message_to_js(app: tauri::AppHandle, command: &str) {
    test_app_handle(app.clone(), command.parse().unwrap()).await;
}

fn define_outputs(conn: &mut SimConnector) {
    let categories = get_output_categories();
    for category in categories {
        println!("Category: {}", category.name);
        for output in category.outputs {
            conn.add_data_definition(
                RequestModes::FLOAT,
                &*output.output_name,
                &*output.metric,
                simconnect::SIMCONNECT_DATATYPE_SIMCONNECT_DATATYPE_FLOAT64,
                output.prefix,
                output.update_every,
            );
            println!("Output: {}", output.output_name);
        }
    }
}

fn subscribe_to_events(conn: &mut SimConnector) {
    let events = Events::new();
    for event in events.available_events {
        conn.subscribe_to_system_event(event.1.id, event.1.description);
    }
}

fn connect_simconnect() {
    let mut conn = simconnect::SimConnector::new();
    let events = Events::new();
    conn.connect("SimConnect Tauri");
    let epsilon: f32 = 100.000000;
    //let context = conn.get_context();
    //conn.call_dispatch(Some(call_dispatch), context);

    conn.add_data_definition(
        RequestModes::STRING,
        "TITLE",
        "",
        simconnect::SIMCONNECT_DATATYPE_SIMCONNECT_DATATYPE_STRING256,
        202,
        0.0,
    );

    define_outputs(&mut conn);
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
        match conn.get_next_message() {
            Ok(simconnect::DispatchResult::SimobjectData(data)) => {
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
                    _ => (),
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
    parse_json("src/events/outputs.json")
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            start_com_connection,
            get_com_ports
        ])
        .setup(|app| {
            std::thread::spawn(move || {
                connect_simconnect();
            });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
