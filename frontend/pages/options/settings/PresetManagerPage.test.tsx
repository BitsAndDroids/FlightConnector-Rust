import { describe, test, expect, beforeEach } from "vitest";
import { PresetManagerPage } from "./PresetManagerPage";
import { render } from "@testing-library/react";
import { setupTauriInternalMocks } from "@/tests/testUtils";

describe("PresetManagerPage", () => {
  beforeEach(() => {
    setupTauriInternalMocks();
  });
  test("renders without crashing", () => {
    const { container } = render(<PresetManagerPage />);
    expect(container).toBeTruthy();
  });
  test("renders the preset manager", () => {
    const { getByTestId } = render(<PresetManagerPage />);
    const element = getByTestId("preset_manager_component");
    expect(element).toBeTruthy();
  });
});
