#[cfg(test)]
#[path = "output_parser_tests.rs"]
mod output_parser_tests;

pub mod output_parser {

    use crate::events::output::output::Output;

    pub fn get_outputs_from_file(path: &str) -> Vec<Output> {
        let file = std::fs::File::open(path)
            .unwrap_or_else(|_| panic!("Failed to open file at {:?}", &path));
        let reader = std::io::BufReader::new(file);
        let outputs: Vec<Output> = serde_json::from_reader(reader)
            .unwrap_or_else(|_| panic!("Failed to parse JSON from file at {:?}", &path));
        let mut output_vec: Vec<Output> = Vec::new();
        for output in outputs {
            output_vec.push(output.clone());
        }
        //sort categories by name
        output_vec
    }
}
