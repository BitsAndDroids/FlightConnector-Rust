import { PartnerDevice } from "#partner_devices/models/PartnerDevice.js";
import { LazyStore } from "#store";

export class TrackedDevicesHandler {
  store: LazyStore;

  constructor() {
    this.store = new LazyStore(".tracked_devices.dat");
  }

  async addTrackedDevice(device: PartnerDevice) {
    this.store.set(device.id, device.version);
    this.store.save();
  }

  async updateTrackedDeviceVersion(device: PartnerDevice) {
    this.store.set(device.id, device.version);
    this.store.save();
  }

  async checkIfUpdateAvailable(device: PartnerDevice): Promise<boolean> {
    const storedVersion = await this.store.get(device.id);
    if (storedVersion === undefined) {
      return true;
    }
    return storedVersion !== device.version;
  }
}
