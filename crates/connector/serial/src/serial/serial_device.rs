use std::time::Duration;

use log::{error, info};
use serialport::{Error, SerialPort, SerialPortType};

pub struct SerialDevice {
    port: Box<dyn SerialPort>,
    name: String,
    _trs: bool,
}

pub trait Serial {
    fn new(device_name: String, trs: bool) -> Result<Self, Error>
    where
        Self: Sized;
    fn get_name(&self) -> String;
    fn send_connected_signal(&mut self, connected: bool);
    fn read_full_message(&mut self) -> Option<String>;
    fn write(&mut self, data: &[u8]);
}

impl Serial for SerialDevice {
    fn new(device_name: String, trs: bool) -> Result<Self, Error> {
        let ports = serialport::available_ports().unwrap_or_else(|_| Vec::new());
        let ports_output = ports
            .iter()
            .map(|port| {
                let port_type_info = match &port.port_type {
                    SerialPortType::UsbPort(info) => (match &info.product {
                        Some(product) => product.to_string(),
                        None => "Unknown".to_string(),
                    })
                    .to_string(),
                    SerialPortType::BluetoothPort => "BluetoothSerial".to_string(),
                    SerialPortType::PciPort => "PCI Serial".to_string(),
                    _ => "".to_string(),
                };
                format!("{}, {}", port.port_name.as_str(), port_type_info)
            })
            .collect::<Vec<_>>();

        let com_port = device_name.clone();
        let flow_control = if ports_output.iter().any(|s| {
            s.contains(&format!("({})", &com_port))
                && (s.contains("Leonardo") || s.contains("Micro"))
        }) {
            serialport::FlowControl::Hardware
        } else {
            serialport::FlowControl::Software
        };

        match serialport::new(com_port.clone(), 115200)
            .flow_control(flow_control)
            .timeout(Duration::from_millis(50))
            .open()
        {
            Ok(mut port) => {
                if trs {
                    match port.write_data_terminal_ready(true) {
                        Ok(_) => {
                            info!("Data terminal ready open sent")
                        }
                        Err(e) => {
                            error!("Failed to send data terminal open ready: {}", e)
                        }
                    };
                    std::thread::sleep(Duration::from_millis(500));
                    match port.write_data_terminal_ready(false) {
                        Ok(_) => {
                            info!("Data terminal ready close sent")
                        }
                        Err(e) => {
                            error!("Failed to send data terminal close ready: {}", e)
                        }
                    };
                }
                std::thread::sleep(Duration::from_millis(400));
                Ok(SerialDevice {
                    port,
                    _trs: trs,
                    name: device_name,
                })
            }
            Err(e) => {
                error!(target: "connections", "Failed to open port: {}", e);
                Err(e)
            }
        }
    }
    fn write(&mut self, data: &[u8]) {
        let mut remaining_data = data;
        while !remaining_data.is_empty() {
            match self.port.write(remaining_data) {
                Ok(written) => {
                    remaining_data = &remaining_data[written..];
                }
                Err(e) => {
                    error!(target: "connections", "Failed to send data: {}", e);
                    break;
                }
            }
        }
    }
    fn get_name(&self) -> String {
        self.name.clone()
    }
    fn send_connected_signal(&mut self, connected: bool) {
        let message = if connected { b"0001 1\n" } else { b"0001 0\n" };
        match self.port.write_all(message) {
            Ok(_) => {
                info!(target: "connections", "Connected signal sent {}", connected);
            }
            Err(e) => {
                error!(target: "connections", "Failed to send connected signal: {}", e);
            }
        }
    }

    fn read_full_message(&mut self) -> Option<String> {
        let mut buffer: Vec<u8> = Vec::new();
        let mut byte = [0u8; 1];
        let mut reading = true;
        let mut message: String = "".to_string();
        match self.port.bytes_to_read() {
            Ok(result) => {
                if result == 0 {
                    return None;
                }
                while reading {
                    match self.port.read(&mut byte) {
                        Ok(bytes_read) => {
                            (0..bytes_read).for_each(|i| {
                                if byte[i] == b'\n' || byte[i] == b'\r' {
                                    message = String::from_utf8_lossy(&buffer).to_string();
                                    buffer.push(byte[i]);
                                    buffer.clear();
                                    //set buffer to \n
                                    reading = false;
                                } else if byte[i] != b'\r' {
                                    buffer.push(byte[i]);
                                }
                            });
                        }
                        Err(e) => {
                            match e.kind() {
                                std::io::ErrorKind::TimedOut => {
                                    // Handle timeout error here
                                    info!(target: "connections", "{} Read timed out", self.name);
                                    return None;
                                }
                                _ => {
                                    error!(target: "connections", "{} Failed to read bytes: {}", self.name, e);
                                }
                            }
                        }
                    }
                }
            }
            Err(e) => error!(target: "connections", "{} Failed to read bytes: {}", self.name, e),
        }

        Some(message)
    }
}
