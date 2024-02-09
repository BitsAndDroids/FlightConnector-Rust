import { Bundle } from "@/model/Bundle";
import { Store } from "tauri-plugin-store-api";
export class BundleSettingsHander {
  store: Store;
  bundleStore: Store;

  constructor() {
    this.store = new Store(".settings.dat");
    this.bundleStore = new Store(".bundleSettings.dat");
  }

  async getBundleSettings(): Promise<Bundle[]> {
    const bundleKeys = await this.bundleStore.keys();
    const bundles = [];
    for (const key of bundleKeys) {
      const bundle = (await this.bundleStore.get(key)) as Bundle;
      bundles.push(bundle);
    }
    return bundles;
  }

  addBundleSettings(bundle: Bundle): any {
    this.bundleStore.set(bundle.name, bundle);
    this.bundleStore.save();
  }

  updateBundleSettings(bundle: Bundle): any {
    this.bundleStore.set(bundle.name, bundle);
    this.bundleStore.save();
  }

  deleteBundleSettings(bundle: Bundle): any {
    this.bundleStore.delete(bundle.name);
    this.bundleStore.save();
  }

  async getSavedBundles(): Promise<Bundle[]> {
    const bundles = [];
    const keys = await this.bundleStore.keys();
    for (const key of keys) {
      console.log(key);
      bundles.push((await this.bundleStore.get(key)) as Bundle);
    }
    return bundles;
  }
}
