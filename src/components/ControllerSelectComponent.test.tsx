import { render, screen } from "@testing-library/react";
import { describe, vi, expect, test, beforeAll } from "vitest";
import { ControllerSelectComponent } from "./ControllerSelectComponent";
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

vi.mock("./ControllerSelectComponent", async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import("./ControllerSelectComponent")>()),
    saveBundle: vi.fn(),
  };
});

describe("ControllerSelectComponent", async () => {
  test("renders without crashing", async () => {
    render(<ControllerSelectComponent />);
    const element = await screen.findByTestId("controller_select");
    expect(element).toBeTruthy();
  });
});
