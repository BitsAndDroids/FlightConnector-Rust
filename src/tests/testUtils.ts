import { clearMocks } from "@tauri-apps/api/mocks";
import { randomFillSync } from "crypto";
import { vi } from "vitest";

declare global {
  interface Window {
    __TAURI_INTERNALS__: {
      invoke: (command: string, args?: any) => Promise<any>;
      transformCallback: (callback: Function) => Function;
    };
  }
}

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
