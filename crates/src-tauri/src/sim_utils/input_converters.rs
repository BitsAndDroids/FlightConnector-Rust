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
