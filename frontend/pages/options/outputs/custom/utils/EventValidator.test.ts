import { beforeEach, describe, expect, test } from "vitest";
import { validateEventID } from "./EventValidator";
import { setupTauriInternalMocks } from "#tests/testUtils.js";

describe("EventValidator", () => {
  beforeEach(() => {
    setupTauriInternalMocks();
  });
  test("If id < 3000 set correct state", async () => {
    //
    const id = "2999";
    const errorState = await validateEventID(id);
    expect(errorState?.id?.state).toBe(true);
  });
});
