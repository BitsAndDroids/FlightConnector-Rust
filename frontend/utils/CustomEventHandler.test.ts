import { setupTauriInternalMocks } from "@/tests/testUtils";
import { describe, beforeEach, test, vi, it, expect } from "vitest";
import { CustomEventHandler } from "./CustomEventHandler";
import { WASMEvent } from "@/model/WASMEvent";
import { LazyStore } from "#store";

describe("CustomEventHandler", () => {
  vi.mock("@tauri-apps/plugin-store", () => {
    const Store = vi.fn();
    Store.prototype.get = vi.fn();
    Store.prototype.set = vi.fn();
    Store.prototype.save = vi.fn();
    Store.prototype.delete = vi.fn();
    Store.prototype.keys = vi.fn();
    return { Store };
  });

  let store: any;
  let handler: CustomEventHandler;

  beforeEach(() => {
    store = new LazyStore("test");
    handler = new CustomEventHandler();
  });

  beforeEach(() => {
    setupTauriInternalMocks();
  });
  it("should get event", async () => {
    const id = "1";
    await handler.getEvent(id);
    expect(store.get).toHaveBeenCalledWith(id);
  });

  it("should update event", async () => {
    const event: WASMEvent = { id: 1 /* other properties */ } as any;
    await handler.updateEvent(event);
    expect(store.get).toHaveBeenCalledWith(event.id.toString());
    expect(store.save).toHaveBeenCalled();
  });

  it("should add event", async () => {
    const event: WASMEvent = { id: 1 /* other properties */ } as any;
    await handler.addEvent(event);
    expect(store.set).toHaveBeenCalledWith(event.id.toString(), event);
    expect(store.save).toHaveBeenCalled();
  });

  it("should delete event", async () => {
    const id = 1;
    await handler.deleteEvent(id);
    expect(store.delete).toHaveBeenCalledWith(id.toString());
    expect(store.save).toHaveBeenCalled();
  });

  it("should get all events", async () => {
    store.keys.mockResolvedValue(["1", "2"]);
    const event: WASMEvent = { id: 1 /* other properties */ } as any;
    store.get.mockResolvedValue(event);
    const events = await handler.getAllEvents();
    expect(events).toEqual([event, event]);
  });
});
