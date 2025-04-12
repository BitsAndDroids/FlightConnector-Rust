use serialport::SerialPortType;

pub fn get_serial_devices() -> Vec<String> {
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
    ports_output
}
