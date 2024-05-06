import { WASMEvent } from "@/model/WASMEvent";
import { Store } from "@tauri-apps/plugin-store";

export class CustomEventHandler {
  store: Store;
  constructor() {
    this.store = new Store(".events.dat");
  }
  async getEvent(id: string): Promise<any> {
    return this.store.get(id);
  }

  async updateEvent(event: WASMEvent) {
    this.store.set(event.id.toString(), event);
    this.store.save();
  }

  async addEvent(event: WASMEvent) {
    this.store.set(event.id.toString(), event);
    this.store.save();
  }

  async deleteEvent(id: string) {
    this.store.delete(id);
    this.store.save();
  }

  async getAllEvents(): Promise<WASMEvent[]> {
    const keys = await this.store.keys();
    const events: WASMEvent[] = [];
    for (const key of keys) {
      const event = (await this.store.get(key)) as WASMEvent;
      if (event) {
        events.push(event);
      }
    }
    return events;
  }
}
