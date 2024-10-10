import { Preset } from "@/model/Preset";
import { Store } from "@tauri-apps/plugin-store";

export class PresetSettingsHandler {
  store: Store;
  constructor() {
    this.store = new Store(".presets.dat");
  }

  async getPreset(id: string): Promise<Preset | null> {
    if (!this.store.has(id)) {
      return null;
    }
    return this.store.get(id);
  }
  async updatePreset(preset: Preset): Promise<void> {
    this.store.set(preset.id, preset);
    this.store.save();
  }
  async deletePreset(id: string): Promise<void> {
    this.store.delete(id);
    this.store.save();
  }
  async addPreset(preset: Preset): Promise<void> {
    this.store.set(preset.id, preset);
    this.store.save();
  }
  async migratePreset(preset: Preset): Promise<void> {
    const data: any = preset;
    if (data.runBundles) {
      for (const runBundle of data.runBundles) {
        if (runBundle.bundle) {
          runBundle.bundle_name = runBundle.bundle.name;
          delete runBundle.bundle;
        }
      }
    }
    this.updatePreset(data);
  }
  async getPresetById(id: string): Promise<Preset | null> {
    return this.store.get(id);
  }
  async getAllPresets(): Promise<Preset[]> {
    const keys = await this.store.keys();
    const presets: Preset[] = [];
    for (const key of keys) {
      const preset = (await this.store.get(key)) as Preset;
      this.migratePreset(preset);
      if (preset) {
        presets.push(preset);
      }
    }
    return presets;
  }
}
