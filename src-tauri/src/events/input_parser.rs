pub mod output_parser {
    use crate::events::input::Input;

    pub fn get_inputs_from_file(path: &str) -> Vec<Input> {
        let file = std::fs::File::open(&path)
            .expect(format!("Failed to open file at {:?}", &path).as_str());
        let reader = std::io::BufReader::new(file);
        let inputs: Vec<Input> = serde_json::from_reader(reader).unwrap();
        inputs
    }
}
