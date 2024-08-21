use log::{error, info};
use serialport::{Error, SerialPort, SerialPortType};
use std::time::Duration;

pub struct Serial {
    port: Box<dyn SerialPort>,
    name: String,
    _trs: bool,
}

pub trait Commands {
    fn send_connected_signal(&mut self, connected: bool);
    fn read_full_message(&mut self) -> Option<String>;
    fn write(&mut self, data: &[u8]) -> Result<usize, std::io::Error>;
    fn get_name(&self) -> String;
}

impl Serial {
    pub fn new(device_name: String, trs: bool) -> Result<Self, Error> {
        let ports = match serialport::available_ports() {
            Ok(ports) => ports,
            Err(_) => Vec::new(),
        };
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
            .open()
        {
            Ok(mut port) => {
                // if connector_settings is Some()
                if trs {
                    match port.write_data_terminal_ready(true) {
                        Ok(_) => {
                            println!("Data terminal ready sent")
                        }
                        Err(e) => {
                            println!("Failed to send data terminal ready: {}", e)
                        }
                    };
                    std::thread::sleep(Duration::from_millis(300));
                    match port.write_data_terminal_ready(false) {
                        Ok(_) => {
                            println!("Data terminal ready sent")
                        }
                        Err(e) => {
                            println!("Failed to send data terminal ready: {}", e)
                        }
                    };
                }
                std::thread::sleep(Duration::from_millis(400));
                Ok(Serial {
                    port,
                    _trs: trs,
                    name: device_name,
                })
            }
            Err(e) => {
                error!(target: "connections", "Failed to open port: {}", e);
                println!("Failed to open port: {}", e);
                Err(e)
            }
        }
    }
}

impl Commands for Serial {
    fn write(&mut self, data: &[u8]) -> Result<usize, std::io::Error> {
        self.port.write(data)
    }
    fn get_name(&self) -> String {
        self.name.clone()
    }
    fn send_connected_signal(&mut self, connected: bool) {
        let message = if connected { b"0001 1\n" } else { b"0001 0\n" };
        match self.port.write_all(message) {
            Ok(_) => {
                info!(target: "connections", "Connected signal sent");
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
                        Err(e) => eprintln!("{:?}", e),
                    }
                }
            }
            Err(e) => eprintln!("{:?}", e),
        }

        Some(message)
    }
}
