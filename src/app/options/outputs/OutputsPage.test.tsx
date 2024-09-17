import { render } from "@testing-library/react";
import { describe, vi, expect, test, beforeAll } from "vitest";
import OutputsPage from "./OutputsPage";
import { randomFillSync } from "crypto";
import { clearMocks } from "@tauri-apps/api/mocks";

declare global {
  interface Window {
    __TAURI_INTERNALS__: {
      invoke: (command: string, args?: any) => Promise<any>;
    };
  }
}

beforeAll(() => {
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
  };
});

vi.mock("./OutputsPage", async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import("./OutputsPage")>()),
    saveBundle: vi.fn(),
  };
});

describe("OutputsPage", async () => {
  test("renders without crashing", () => {
    const { container } = render(<OutputsPage />);
    expect(container).toBeTruthy();
  });
});
