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
}
