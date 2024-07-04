import { RunBundle } from "@/model/RunBundle";
import { Store } from "@tauri-apps/plugin-store";
import { ConnectorSettings } from "./models/ConnectorSettings";
export class ConnectorSettingsHandler {
  runSettingsStore: Store;
  constructor() {
    this.runSettingsStore = new Store(".connectorSettings.dat");
  }

  async setCommunityFolderPath(folder: string): Promise<void> {
    this.runSettingsStore.set("communityFolderPath", folder);
    this.runSettingsStore.save();
  }

  async setLibraryFolderPath(folder: string): Promise<void> {
    this.runSettingsStore.set("libraryFolderPath", folder);
    this.runSettingsStore.save();
  }

  async setWASMModulePath(path: string): Promise<void> {
    this.runSettingsStore.set("wasmModulePath", path);
    this.runSettingsStore.save();
  }

  async setConnectorSettings(settings: ConnectorSettings): Promise<void> {
    this.runSettingsStore.set("connectorSettings", settings);
    this.runSettingsStore.save();
  }

  async setLatestPatchNotesRead(patchNotes: string): Promise<void> {
    this.runSettingsStore.set("latestPatchNotesRead", patchNotes);
    this.runSettingsStore.save();
  }

  async getConnectorSettings(): Promise<ConnectorSettings | null> {
    return await this.runSettingsStore.get("connectorSettings");
  }

  async getCommunityFolderPath(): Promise<string | null> {
    return await this.runSettingsStore.get("communityFolderPath");
  }

  async getLibraryFolderPath(): Promise<string | null> {
    return await this.runSettingsStore.get("libraryFolderPath");
  }

  async getWASMModulePath(): Promise<string | null> {
    return await this.runSettingsStore.get("wasmModulePath");
  }

  async getLatestPatchNotesRead(): Promise<string | null> {
    return await this.runSettingsStore.get("latestPatchNotesRead");
  }

  async getAllConnectorSettings(): Promise<any> {
    const keys = await this.runSettingsStore.keys();
    const settings = {};
    for (const key of keys) {
      // @ts-ignore
      settings[key] = await this.runSettingsStore.get(key);
    }
    return settings;
  }
}
