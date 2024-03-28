pub mod output_registry {
    use connector_types::types::{category::Category, output::Output};
    use file_parsers::parsers::output_parser;

    #[derive(Clone, Debug)]
    pub struct OutputRegistry {
        pub categories: Vec<Category>,
        pub outputs: Vec<Output>,
        output_path: String,
    }

    impl OutputRegistry {
        pub fn new() -> OutputRegistry {
            OutputRegistry {
                categories: Vec::new(),
                outputs: Vec::new(),
                output_path: String::from("src/events/outputs.json"),
            }
        }
        pub fn load_outputs(&mut self) {
            self.outputs = output_parser::get_outputs_from_file(&self.output_path);
        }

        pub fn get_category(&self, category_name: &str) -> Option<&Category> {
            self.categories
                .iter()
                .find(|&category| category.name == category_name)
        }

        pub fn get_output_by_id(&self, output_id: u32) -> Option<&Output> {
            self.outputs.iter().find(|&output| output.id == output_id)
        }

        pub fn get_outputs(&self) -> &Vec<Output> {
            &self.outputs
        }
    }
}
