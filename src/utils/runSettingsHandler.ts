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

  async getAmountOfConnections(): Promise<number> {
    return (await this.runSettingsStore.get("amountOfConnections")) || 1;
  }
}
