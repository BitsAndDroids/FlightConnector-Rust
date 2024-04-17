#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use connector_types::types::output::Output;
use connector_types::types::run_bundle::RunBundle;
use events::output_registry::output_registry;
use lazy_static::lazy_static;
use once_cell::sync::OnceCell;
use serialport::SerialPortType;
use tauri::{AppHandle, Manager};
use tauri_plugin_dialog::DialogExt;
use tauri_plugin_updater::UpdaterExt;
mod events;
mod sim_utils;
mod simconnect_mod;
use std::ops::Deref;
use std::string::ToString;
use std::sync::{mpsc, Arc, Mutex};
use tauri_plugin_log::{Target, TargetKind};

use std::thread;

// #[cfg(target_os = "windows")]
// use window_shadows::set_shadow;
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
fn stop_simconnect_connection() {
    let sender = SENDER.lock().unwrap().deref().clone();
    match sender {
        Some(sender) => {
            match sender.send(9999) {
                Ok(_) => {
                    eprintln!("Sent stop message to simconnect");
                }
                Err(_) => {
                    eprintln!("Failed to send stop message to simconnect");
                }
            };
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
    output_registry.load_outputs();
    output_registry.outputs
}

#[tauri::command]
fn start_simconnect_connection(
    app: tauri::AppHandle,
    run_bundles: Vec<RunBundle>,
    preset_id: String,
) {
    let (tx, rx) = mpsc::channel();
    *SENDER.lock().unwrap() = Some(tx);
    thread::spawn(|| {
        #[cfg(target_os = "windows")]
        let mut simconnect_handler =
            simconnect_mod::simconnect_handler::SimconnectHandler::new(app, rx, preset_id);
        #[cfg(target_os = "windows")]
        simconnect_handler.start_connection(run_bundles);
    });
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(
            tauri_plugin_log::Builder::new()
                .targets([
                    Target::new(TargetKind::Stdout),
                    Target::new(TargetKind::LogDir { file_name: None }),
                    Target::new(TargetKind::Webview),
                ])
                .build(),
        )
        .invoke_handler(tauri::generate_handler![
            get_com_ports,
            get_outputs,
            start_simconnect_connection,
            stop_simconnect_connection /*send_command*/
        ])
        .setup(|app| {
            let app_handle = app.app_handle().clone();
            tauri::async_runtime::spawn(async move {
                let builder = app_handle.updater_builder();
                let updater = builder.build().unwrap();

                let update = match updater.check().await {
                    Ok(Some(update)) => update,
                    Ok(None) => {
                        println!("no update.");
                        return;
                    }
                    Err(err) => {
                        println!("err: {:?}", err);
                        return;
                    }
                };

                let message = app_handle
                    .dialog()
                    .message("A new update is available. Do you want to download and install it?")
                    .title("Update available")
                    .ok_button_label("Update")
                    .cancel_button_label("Later")
                    .blocking_show();

                if message {
                    println!("update available");
                    let Ok(package) = update.download(|_, _| {}, || {}).await else {
                        return;
                    };
                    println!("downloaded");
                    match update.install(package) {
                        Ok(_) => {
                            println!("restart");
                            app_handle.restart();
                        }
                        Err(err) => {
                            println!("err: {:?}", err);
                        }
                    }
                }
            });
            APP_HANDLE.set(app.handle().clone()).unwrap();
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
