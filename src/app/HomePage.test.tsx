import { beforeAll, describe, expect, test, vi } from "vitest";
import HomePage from "./HomePage";
import { render } from "@testing-library/react";
import { clearMocks } from "@tauri-apps/api/mocks";
import { randomFillSync } from "crypto";

describe("HomePage", () => {
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
  test("renders without crashing", () => {
    const { container } = render(<HomePage />);
    expect(container).toBeTruthy();
  });
});
