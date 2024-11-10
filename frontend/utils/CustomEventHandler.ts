import { WASMEvent } from "@/model/WASMEvent";
import { LazyStore } from "#store";

export class CustomEventHandler {
  store: LazyStore;
  constructor() {
    this.store = new LazyStore(".events.dat");
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

  async deleteEvent(id: number) {
    this.store.delete(id.toString());
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
