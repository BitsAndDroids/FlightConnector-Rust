use std::collections::HashMap;

use serialport::SerialPort;

pub fn read_serial_ports(ports: &mut HashMap<String, Box<dyn SerialPort>>) -> Vec<String> {
    let mut messages = vec![];
    for active_com_port in ports {
        let mut buffer: Vec<u8> = Vec::new();
        let mut byte = [0u8; 1];
        let mut reading = true;
        match active_com_port.1.bytes_to_read() {
            Ok(result) => {
                if result == 0 {
                    continue;
                }
                while reading {
                    match active_com_port.1.read(&mut byte) {
                        Ok(bytes_read) => {
                            (0..bytes_read).for_each(|i| {
                                if byte[i] == b'\n' || byte[i] == b'\r' {
                                    let message = String::from_utf8_lossy(&buffer);
                                    messages.push(message.to_string());
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
    }
    messages
}

// TODO: move serial read logic to a separate thread
