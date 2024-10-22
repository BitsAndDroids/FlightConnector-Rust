import { beforeEach, describe, expect, test, vi } from "vitest";
import { validateEventID } from "./EventValidator";
import { setupTauriInternalMocks } from "#tests/testUtils.js";

describe("EventValidator", () => {
  vi.mock("@/utils/CustomEventHandler", () => {
    const CustomEventHandler = vi.fn();
    CustomEventHandler.prototype.getAllEvents = vi.fn();
    CustomEventHandler.prototype.getEvent = vi.fn();
    return { CustomEventHandler };
  });
  beforeEach(() => {
    setupTauriInternalMocks();
  });
  test("If id < 3000 set correct state", async () => {
    const id = "2999";
    const errorState = await validateEventID(id);
    expect(errorState?.id?.state).toBe(true);
  });
  test("If id > 9999 set correct state", async () => {
    const id = "10000";
    const errorState = await validateEventID(id);
    expect(errorState?.id?.state).toBe(true);
  });
  test("If id  already exists set correct state", async () => {
    const id = "";
    const errorState = await validateEventID(id);
    expect(errorState?.id?.state).toBe(true);
  });
  test("Should return no error message if id < 3000", async () => {
    const id = "3010";
    const errorState = await validateEventID(id);
    expect(errorState?.id?.state).toBe(false);
  });
});
