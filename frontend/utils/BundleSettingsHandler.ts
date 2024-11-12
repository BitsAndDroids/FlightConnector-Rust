import { Bundle } from "@/model/Bundle";
import { LazyStore } from "#store";
export class BundleSettingsHandler {
  bundleStore: LazyStore;

  constructor() {
    this.bundleStore = new LazyStore(".bundleSettings.dat");
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

  getBundleSettingsByName(name: string): Promise<Bundle> {
    return this.bundleStore.get(name) as Promise<Bundle>;
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
      bundles.push((await this.bundleStore.get(key)) as Bundle);
    }
    return bundles;
  }
}
