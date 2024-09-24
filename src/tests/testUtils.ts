import { clearMocks } from "@tauri-apps/api/mocks";
import { randomFillSync } from "crypto";
import { vi } from "vitest";

export const setupTauriInternalMocks = () => {
  clearMocks();
  Object.defineProperty(window, "crypto", {
    value: {
      // @ts-ignore
      getRandomValues: (buffer) => {
        return randomFillSync(buffer);
      },
    },
  });
  global.window.__TAURI_INTERNALS__ = {
    invoke: vi.fn().mockResolvedValue([]),
    transformCallback: vi.fn().mockResolvedValue([]),
  };
};
