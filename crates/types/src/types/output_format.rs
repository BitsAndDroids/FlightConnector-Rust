use super::output::Output;

pub trait FormatOutput {
    fn get_output_format(&self) -> Output;
}
