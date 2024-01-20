use crate::events::category::Category;
use crate::events::output_parser::output_parser;

use super::output::Output;

#[derive(Debug)]
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
        self.categories = output_parser::get_categories_from_file(self.output_path.as_str());
        for category in &self.categories {
            for output in &category.outputs {
                self.outputs.push(output.clone());
            }
        }
    }

    pub fn get_categories() -> Vec<Category> {
        output_parser::get_categories_from_file("src/events/outputs.json")
    }

    pub fn get_category(&self, category_name: &str) -> Option<&Category> {
        for category in &self.categories {
            if category.name == category_name {
                return Some(category);
            }
        }
        None
    }

    pub fn get_output_by_id(&self, output_id: u32) -> Option<&Output> {
        for output in &self.outputs {
            if output.id == output_id {
                return Some(output);
            }
        }
        None
    }

    pub fn get_outputs(&self) -> &Vec<Output> {
        &self.outputs
    }
}
