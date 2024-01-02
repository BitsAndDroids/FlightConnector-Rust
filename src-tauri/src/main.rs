// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::io::Read;
use tauri::Manager;
use serialport::SerialPort;
use tokio::io::{self, AsyncBufReadExt};
use tokio_util::compat::FuturesAsyncReadCompatExt;

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
    app.emit_all("event-name", Payload { message: format!("{}", message) }).unwrap();
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
            },
            Err(ref e) if e.kind() == io::ErrorKind::TimedOut => (),
            Err(e) => eprintln!("{:?}", e),
        }
        tokio::time::sleep(std::time::Duration::from_micros(10)).await;
    }
}

async fn send_message_to_js(app: tauri::AppHandle, command: &str) {
    test_app_handle(app.clone(), command.parse().unwrap()).await;
}

fn main() {

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![start_com_connection, get_com_ports])
        .setup(|app| {
            let resource_path = app.path_resolver()
                .resolve_resource("src/events/outputs.json")
                .expect("failed to resolve resource");

            let categories = parse_json(resource_path.to_str().unwrap());
            for category in categories {
                println!("Category: {}", category.name);
                for output in category.outputs {
                    println!("Output: {}", output.output_name);
                }
            }

            Ok(())
            })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

}
