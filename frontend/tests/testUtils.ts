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
  const mockInvoke = vi.fn().mockResolvedValue([]);
  const mockTransformCallback = vi.fn().mockResolvedValue([]);
  global.window.__TAURI_INTERNALS__ = {
    invoke: mockInvoke,
    transformCallback: mockTransformCallback,
  };

  return { mockInvoke, mockTransformCallback };
};
