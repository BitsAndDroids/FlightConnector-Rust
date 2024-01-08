pub mod output_parser {
    use crate::events::category::Category;
    use crate::events::output::Output;
    use std::collections::HashMap;

    pub fn get_categories_from_file(path: &str) -> Vec<Category> {
        let file = std::fs::File::open(&path)
            .expect(format!("Failed to open file at {:?}", &path).as_str());
        let reader = std::io::BufReader::new(file);
        let categories: HashMap<String, Vec<Output>> = serde_json::from_reader(reader).unwrap();
        let mut category_vec: Vec<Category> = Vec::new();
        // categories is now a HashMap mapping category names to Output vectors
        for (category, outputs) in &categories {
            let mut output_vec: Vec<Output> = Vec::new();
            for output in outputs {
                output_vec.push(output.clone());
            }
            category_vec.push(Category {
                name: category.clone(),
                outputs: output_vec,
            });
        }
        category_vec
    }
}
