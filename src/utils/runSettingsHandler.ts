import { Preset } from "@/model/Preset";
import { RunBundle } from "@/model/RunBundle";
import { Store } from "tauri-plugin-store-api";
export class RunSettingsHandler {
  runSettingsStore: Store;
  constructor() {
    this.runSettingsStore = new Store(".runSettings.dat");
  }

  setAmountOfConnections(amount: number): any {
    this.runSettingsStore.set("amountOfConnections", amount);
    this.runSettingsStore.save();
  }

  setLastRunBundles(bundles: RunBundle[]): any {
    this.runSettingsStore.set("lastRunBundles", bundles);
    this.runSettingsStore.save();
  }

  setLastPresetId(id: string): any {
    this.runSettingsStore.set("lastPresetId", id);
    this.runSettingsStore.save();
  }

  async getLastPresetId(): Promise<string | null> {
    return await this.runSettingsStore.get("lastPresetId");
  }

  async getLastRunBundles(): Promise<RunBundle[]> {
    return (await this.runSettingsStore.get("lastRunBundles")) || [];
  }

  async getAmountOfConnections(): Promise<number> {
    return (await this.runSettingsStore.get("amountOfConnections")) || 1;
  }
}
