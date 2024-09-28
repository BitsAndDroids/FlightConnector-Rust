pub fn radian_to_degree(val: f64) -> i32 {
    (val * 180.0 / std::f64::consts::PI) as i32
}

pub fn val_to_dec(val: f64, places: u8) -> String {
    format!("{:.1$}", val, places as usize)
}

pub fn value_to_inhg(val: f64) -> i32 {
    let multiplier = 0.01;
    // this is for 2 decimal places, for 3 decimal places, it would be 0.001, and so on
    let received = (val / multiplier).round() * multiplier; // rounding off to 2 decimal places
    (received * 100.0) as i32
}
pub fn seconds_to_time(val: f64) -> String {
    let sec_from_midnight = val as i32;
    let hours = sec_from_midnight / 3600;
    let total_secs = sec_from_midnight % 3600;
    let minutes = (total_secs) / 60;
    let seconds = (total_secs) % 60;
    format!("{:02}:{:02}:{:02}", hours, minutes, seconds)
}

pub fn val_to_bool(val: f64) -> String {
    if val > 0.5 {
        "1".to_string()
    } else {
        "0".to_string()
    }
}

pub fn mps_to_kmh(val: f64) -> String {
    (val * 3.6).to_string()
}

pub fn mps_to_kts(val: f64) -> String {
    (val * 1.94384).to_string()
}
