#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use connector_types::types::output::Output;
use connector_types::types::run_bundle::RunBundle;
use events::output_registry;
use lazy_static::lazy_static;
use once_cell::sync::OnceCell;
use serde::{Deserialize, Serialize};
use serial::serial::serial_utils::get_serial_devices;
use tauri::{AppHandle, Emitter, Manager};
use tauri_plugin_dialog::{DialogExt, MessageDialogButtons};
use tauri_plugin_store::StoreExt;
use tauri_plugin_updater::UpdaterExt;
mod debug;
mod events;
mod settings;
mod sim_utils;
mod simconnect_mod;
mod utils;
use events::{get_latest_custom_event_version, get_wasm_events, reload_custom_events};
use settings::settings_actions::toggle_run_on_sim_launch;
use std::collections::HashMap;
use std::ops::Deref;
use std::string::ToString;
use std::sync::{mpsc, Arc, Mutex};
use tauri_plugin_log::{Target, TargetKind};
use utils::library_handler::generate_library;
use utils::library_handler::get_library_header_content;
use utils::library_handler::get_library_outputs;
use utils::library_handler::get_library_source_content;
use utils::wasm_installer::{check_if_wasm_up_to_date, install_wasm};

use std::{env, thread};
#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
struct Message {
    id: u32,
    value: i32,
}

lazy_static! {
    static ref SENDER: Arc<Mutex<Option<mpsc::Sender<Message>>>> = Arc::new(Mutex::new(None));
    static ref RECEIVER: Arc<Mutex<Option<mpsc::Receiver<Message>>>> = Arc::new(Mutex::new(None));
}

static APP_HANDLE: OnceCell<AppHandle> = OnceCell::new();
static LAUNCH_ON_STARTUP: OnceCell<bool> = OnceCell::new();

pub fn get_app_handle() -> Option<&'static AppHandle> {
    APP_HANDLE.get()
}

pub fn get_launch_on_startup() -> Option<&'static bool> {
    LAUNCH_ON_STARTUP.get()
}

#[tauri::command]
fn stop_simconnect_connection() {
    let sender = SENDER.lock().unwrap().deref().clone();
    match sender {
        Some(sender) => {
            match sender.send(Message { id: 0, value: 9999 }) {
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
    get_serial_devices()
}

#[tauri::command]
async fn launch_on_startup() -> bool {
    if let Some(launch_on_startup) = get_launch_on_startup() {
        return *launch_on_startup;
    }
    false
}

#[tauri::command]
async fn get_outputs(app: tauri::AppHandle) -> Vec<Output> {
    let mut output_registry = output_registry::OutputRegistry::new();
    let mut wasm_registry = events::wasm_registry::WASMRegistry::new();
    output_registry.load_outputs();
    wasm_registry.load_wasm(&app);

    //merge the two outputs from the registries
    //using the FormatOutput trait
    let mut outputs: HashMap<u32, Output> = HashMap::new();
    for (_, output) in output_registry.get_outputs().iter() {
        outputs.insert(output.id, output.clone());
    }
    for (_, output) in wasm_registry.get_wasm_outputs().iter() {
        outputs.insert(output.id, output.clone().into());
    }
    let outputs: Vec<Output> = outputs.into_values().collect();
    outputs
}

#[tauri::command]
fn send_debug_message(app: tauri::AppHandle, message: Message) {
    println!("Received message: {:?}", message);
    let sender = SENDER.lock().unwrap().deref().clone().unwrap();
    sender.send(message).unwrap();
}

#[tauri::command]
fn start_simconnect_connection(app: tauri::AppHandle, run_bundles: Vec<RunBundle>, debug: bool) {
    let (tx, rx) = mpsc::channel();
    *SENDER.lock().unwrap() = Some(tx);
    *RECEIVER.lock().unwrap() = Some(rx);

    let receiver = RECEIVER.lock().unwrap().take().expect("Receiver not found");
    thread::spawn(|| {
        #[cfg(target_os = "windows")]
        let mut simconnect_handler =
            simconnect_mod::simconnect_handler::SimconnectHandler::new(app, receiver, true);
        #[cfg(target_os = "windows")]
        simconnect_handler.start_connection(run_bundles);
    });
}

#[tauri::command]
fn update_default_events(app: tauri::AppHandle) {
    let mut wasm_registry = events::wasm_registry::WASMRegistry::new();
    wasm_registry.load_default_events();
    wasm_registry.update_defauts_to_store(app);
}

fn init_wasm_events_to_store(app: tauri::AppHandle) {
    let store = app.store(".events.dat").expect("Failed to get store");
    let keys = store.keys();

    if keys.is_empty() {
        let mut wasm_registry = events::wasm_registry::WASMRegistry::new();
        wasm_registry.init_custom_events_to_store(&app);
    }
    store.save();
}

fn main() {
    let exe_path = env::current_exe().expect("Failed to get executable path");

    // Get the directory of the executable file
    let exe_dir = exe_path
        .parent()
        .expect("Failed to get executable directory");

    // Change the current directory to the directory of the executable file
    env::set_current_dir(exe_dir).expect("Failed to change current directory");

    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(
            tauri_plugin_log::Builder::new()
                .filter(|metadata| {
                    metadata.target() != "tao::platform_impl::platform::event_loop::runner"
                })
                .targets([
                    Target::new(TargetKind::Stdout),
                    Target::new(TargetKind::LogDir { file_name: None }),
                    Target::new(TargetKind::Webview),
                ])
                .max_file_size(10_000)
                .build(),
        )
        .invoke_handler(tauri::generate_handler![
            get_com_ports,
            send_debug_message,
            get_outputs,
            start_simconnect_connection,
            stop_simconnect_connection, /*send_command*/
            install_wasm,
            get_wasm_events,
            get_latest_custom_event_version,
            reload_custom_events,
            update_default_events,
            get_library_header_content,
            get_library_source_content,
            get_library_outputs,
            toggle_run_on_sim_launch,
            launch_on_startup,
            generate_library
        ])
        .setup(|app| {
            let app_handle = app.app_handle().clone();
            let (tx, rx) = mpsc::channel();
            *SENDER.lock().unwrap() = Some(tx);
            *RECEIVER.lock().unwrap() = Some(rx);

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
                    .buttons(MessageDialogButtons::OkCancelCustom(
                        "Update".to_string(),
                        "Later".to_string(),
                    ))
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
            init_wasm_events_to_store(app.handle().clone());
            if !check_if_wasm_up_to_date(app.handle().clone()) {
                println!("Wasm is not up to date");
                install_wasm(app.handle().clone());
            }
            APP_HANDLE.set(app.handle().clone()).unwrap();
            let args: Vec<String> = std::env::args().collect();
            if args.len() > 1 {
                println!("ARGS FOUND");
                println!("args: {:?}", args);
                app.handle().emit("start_event", "").unwrap();
                LAUNCH_ON_STARTUP.set(true).unwrap();
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
