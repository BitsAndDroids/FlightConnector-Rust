
#[cfg(test)]
use crate::simconnect_mod::output_converters;

#[test]
fn test_radian_to_degree() {
    let val = std::f64::consts::PI;
    let result = output_converters::radian_to_degree(val);
    assert_eq!(result, 180);
    }
}
