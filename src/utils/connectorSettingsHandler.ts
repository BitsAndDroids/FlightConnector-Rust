import { RunBundle } from "@/model/RunBundle";
import { Store } from "@tauri-apps/plugin-store";
export class ConnectorSettingsHandler {
  runSettingsStore: Store;
  constructor() {
    this.runSettingsStore = new Store(".connectorSettings.dat");
  }

  async setCommunityFolderPath(folder: string): Promise<void> {
    this.runSettingsStore.set("communityFolderPath", folder);
    this.runSettingsStore.save();
  }

  async setWASMModulePath(path: string): Promise<void> {
    this.runSettingsStore.set("wasmModulePath", path);
    this.runSettingsStore.save();
  }

  async getCommunityFolderPath(): Promise<string | null> {
    return await this.runSettingsStore.get("communityFolderPath");
  }

  async getWASMModulePath(): Promise<string | null> {
    return await this.runSettingsStore.get("wasmModulePath");
  }
}
