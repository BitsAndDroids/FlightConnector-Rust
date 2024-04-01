import { Preset } from "@/model/Preset";
import { Store } from "tauri-plugin-store-api";

export class PresetSettingsHandler {
  store: Store;
  constructor() {
    this.store = new Store(".presets.dat");
  }

  async getPreset(id: string): Promise<Preset | null> {
    return this.store.get(id);
  }
  async updatePreset(preset: Preset): Promise<void> {
    this.store.set(preset.id, preset);
    this.store.save();
  }
  async addPreset(preset: Preset): Promise<void> {
    this.store.set(preset.id, preset);
    this.store.save();
  }
  async getPresetById(id: string): Promise<Preset | null> {
    return this.store.get(id);
  }
  async getAllPresets(): Promise<Preset[]> {
    const keys = await this.store.keys();
    const presets: Preset[] = [];
    for (const key of keys) {
      const preset = (await this.store.get(key)) as Preset;
      if (preset) {
        presets.push(preset);
      }
    }
    return presets;
  }
}
