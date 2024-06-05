pub fn convert_dec_to_dcb(val: u32) -> u32 {
    let divider = 10;
    let factor = 0x10;
    let remainder = val % divider;
    let quotient = val / divider;
    let mut result = 0;

    if !(quotient == 0 && remainder == 0) {
        result += convert_dec_to_dcb(quotient) * factor + remainder;
    }

    result
}

pub fn map_analog_to_axis(min: f32, val: i32) -> i32 {
    let analog_min = 0.0;
    let analog_max = 1023.0;

    let axis_min = -16383.0 - (-16383.0 * min);
    let axis_max = 16383.0;
    let conv_val = val as f32;

    (axis_min + (axis_max - axis_min) * (conv_val - analog_min) / (analog_max - analog_min)) as i32
}
