#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use connector_types::types::output::Output;
use connector_types::types::output_format::FormatOutput;
use connector_types::types::run_bundle::RunBundle;
use events::output_registry::output_registry;
use lazy_static::lazy_static;
use once_cell::sync::OnceCell;
use serialport::SerialPortType;
use tauri::{AppHandle, Manager};
use tokio::io::{self};
mod events;
mod sim_utils;
mod simconnect_mod;
use std::ops::Deref;
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

lazy_static! {
    static ref SENDER: Arc<Mutex<Option<mpsc::Sender<u16>>>> = Arc::new(Mutex::new(None));
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
    std::thread::spawn(move || {
        tokio::runtime::Builder::new_current_thread()
            .enable_all()
            .build()
            .unwrap()
            .block_on(poll_com_port(app, port))
    });
}

#[tauri::command]
fn stop_simconnect_connection() {
    let sender = SENDER.lock().unwrap().deref().clone();
    match sender {
        Some(sender) => {
            sender.send(9999).unwrap();
        }
        None => {
            eprintln!("Failed to send data");
        }
    }
}

#[tauri::command]
async fn get_com_ports() -> Vec<String> {
    // TODO This
    let ports = match serialport::available_ports() {
        Ok(ports) => ports,
        Err(_) => Vec::new(),
    };
    let ports_output = ports
        .iter()
        .map(|port| {
            let port_type_info = match &port.port_type {
                SerialPortType::UsbPort(info) => format!(
                    "{}",
                    match &info.product {
                        Some(product) => product.to_string(),
                        None => "Unknown".to_string(),
                    }
                ),
                SerialPortType::BluetoothPort => "BluetoothSerial".to_string(),
                SerialPortType::PciPort => "PCI Serial".to_string(),
                _ => "".to_string(),
            };
            format!("{}, {}", port.port_name.as_str(), port_type_info)
        })
        .collect::<Vec<_>>();
    ports_output
}

#[tauri::command]
async fn get_outputs() -> Vec<Output> {
    let mut output_registry = output_registry::OutputRegistry::new();
    let mut wasm_registry = events::wasm_registry::WASMRegistry::new();
    output_registry.load_outputs();
    wasm_registry.load_wasm();

    //merge the two outputs from the registries
    //using the FormatOutput trait
    let mut outputs: Vec<Output> = Vec::new();
    for output in output_registry.get_outputs().iter() {
        outputs.push(output.clone());
    }
    for output in wasm_registry.get_wasm_outputs().iter() {
        outputs.push(output.get_output_format().clone());
    }
    outputs
}

#[tauri::command]
async fn poll_com_port(_app: tauri::AppHandle, port: String) {
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

#[tauri::command]
fn start_simconnect_connection(run_bundles: Vec<RunBundle>) {
    let (tx, rx) = mpsc::channel();
    *SENDER.lock().unwrap() = Some(tx);
    thread::spawn(|| {
        #[cfg(target_os = "windows")]
        let mut simconnect_handler = simconnect_mod::simconnect_handler::SimconnectHandler::new(rx);
        #[cfg(target_os = "windows")]
        simconnect_handler.start_connection(run_bundles);
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
            stop_simconnect_connection /*send_command*/
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
