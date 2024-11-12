import { RunBundle } from "@/model/RunBundle";
import { LazyStore } from "#store";
export class RunSettingsHandler {
  runSettingsStore: LazyStore;
  constructor() {
    this.runSettingsStore = new LazyStore(".runSettings.dat");
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

  async getLastPresetId(): Promise<string | null | undefined> {
    return await this.runSettingsStore.get("lastPresetId");
  }

  async getAllRunSettings(): Promise<any> {
    const keys = await this.runSettingsStore.keys();
    const settings = {};
    for (const key of keys) {
      // @ts-ignore
      settings[key] = await this.runSettingsStore.get(key);
    }
    return settings;
  }

  async getLastRunBundles(): Promise<RunBundle[]> {
    return (await this.runSettingsStore.get("lastRunBundles")) || [];
  }

  async getAmountOfConnections(): Promise<number> {
    return (await this.runSettingsStore.get("amountOfConnections")) || 1;
  }
}
