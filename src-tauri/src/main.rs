#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use crate::events::{output_registry, sim_command};
use events::run_bundle::RunBundle;
use lazy_static::lazy_static;
use once_cell::sync::OnceCell;
use tauri::{AppHandle, Manager};
use tokio::io::{self};

use std::io::Read;
use std::string::ToString;
use std::sync::{mpsc, Arc, Mutex};
use std::time::Duration;
use tauri_plugin_log::LogTarget;

use std::thread;

#[cfg(target_os = "windows")]
use window_shadows::set_shadow;
// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#[cfg(target_os = "windows")]
pub use serialport::SerialPort;
#[cfg(target_os = "windows")]
mod simconnect_mod;

mod events;

lazy_static! {
    static ref SENDER: Arc<Mutex<Option<mpsc::Sender<sim_command::SimCommand>>>> =
        Arc::new(Mutex::new(None));
}

static APP_HANDLE: OnceCell<AppHandle> = OnceCell::new();

pub fn get_app_handle() -> Option<&'static AppHandle> {
    APP_HANDLE.get()
}

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

#[tauri::command]
async fn get_com_ports() -> Vec<String> {
    // TODO This
    println!("Getting COM ports");
    let ports = match serialport::available_ports() {
        Ok(ports) => ports,
        Err(_) => Vec::new(),
    };
    let ports_output = ports
        .iter()
        .map(|port| port.port_name.as_str())
        .map(|port| port.to_string())
        .collect::<Vec<_>>();
    ports_output
}

#[tauri::command]
async fn get_outputs() -> Vec<events::output::Output> {
    println!("Getting outputs");
    let mut output_registry = output_registry::OutputRegistry::new();
    output_registry.load_outputs();
    output_registry.outputs
}

#[tauri::command]
async fn poll_com_port(_app: tauri::AppHandle, port: String) {
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

#[tauri::command]
fn start_simconnect_connection(run_bundle: Vec<RunBundle>) {
    thread::spawn(|| {
        let (tx, rx) = mpsc::channel();
        #[cfg(target_os = "windows")]
        let mut simconnect_handler = simconnect_mod::simconnect_handler::SimconnectHandler::new(rx);
        #[cfg(target_os = "windows")]
        simconnect_handler.start_connection(run_bundle);
        *SENDER.lock().unwrap() = Some(tx);
    });
}

fn main() {
    tauri::Builder::default()
        .plugin(
            tauri_plugin_log::Builder::default()
                .targets([LogTarget::LogDir, LogTarget::Stdout, LogTarget::Webview])
                .build(),
        )
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            start_com_connection,
            get_com_ports,
            get_outputs,
            start_simconnect_connection,
            /*send_command*/
        ])
        .setup(|app| {
            #[cfg(target_os = "windows")]
            let window = app.get_window("bits-and-droids-connector").unwrap();
            #[cfg(target_os = "windows")]
            set_shadow(&window, true).expect("Unsupported platform!");
            APP_HANDLE.set(app.handle().clone()).unwrap();
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
