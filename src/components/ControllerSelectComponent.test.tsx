import { setupTauriInternalMocks } from "@/tests/testUtils";
import { clearMocks } from "@tauri-apps/api/mocks";
import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, test, vi } from "vitest";
import { ControllerSelectComponent } from "./ControllerSelectComponent";

beforeAll(() => {
  clearMocks();
  setupTauriInternalMocks();
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
