use super::bundle::Bundle;

#[derive(Debug)]
pub struct BundleRegistry {
    bundles: Vec<Bundle>,
    bundle_settings_path: String,
}

impl BundleRegistry {
    pub fn new(bundle_settings_path: String) -> BundleRegistry {
        BundleRegistry {
            bundles: Vec::new(),
            bundle_settings_path: ".bundleSettings.dat".parse().unwrap(),
        }
    }
}
