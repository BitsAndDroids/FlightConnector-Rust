pub mod bundle_registry {
    use connector_types::types::bundle::Bundle;

    #[derive(Debug)]
    pub struct BundleRegistry {
        bundles: Vec<Bundle>,
        bundle_settings_path: String,
    }

    impl BundleRegistry {
        pub fn new() -> BundleRegistry {
            BundleRegistry {
                bundles: Vec::new(),
                bundle_settings_path: ".bundleSettings.dat".parse().unwrap(),
            }
        }

        pub fn load_bundle_settings(&mut self) {
            //     if let Some(app_handle) = get_app_handle() {
            //         let stores = app_handle.state::<StoreCollection<Wry>>();
            //         let app_data_dir = app_handle
            //             .app_handle()
            //             .path_resolver()
            //             .app_data_dir()
            //             .unwrap();
            //         let path = PathBuf::from(self.bundle_settings_path.clone());
            //         let combined_path = app_data_dir.join(path);
            //         println!("Loading bundle settings from {:?}", combined_path);
            //         with_store(app_handle.app_handle(), stores, combined_path, |store| {
            //             store
            //                 .insert("test-from-rust".to_string(), json!("why is this not there"))
            //                 .expect("failed to insert data");
            //             store.save()
            //         })
            //         .expect("failed to process store");
            //     } else {
            //         println!("App handle not found");
            //     }
        }
    }
}
