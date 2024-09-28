import { render } from "@testing-library/react";
import { beforeEach, describe, expect, test } from "vitest";
import SettingsPage from "./SettingsPage";
import { setupTauriInternalMocks } from "@/tests/testUtils";

describe("SettingsPage", () => {
  beforeEach(() => {
    setupTauriInternalMocks();
  });
  test("Renders without crashing", () => {
    const { container } = render(<SettingsPage />);
    expect(container).toBeTruthy();
  });
  test("Renders the correct title", () => {
    const { getByText } = render(<SettingsPage />);
    expect(getByText("Settings")).toBeTruthy();
  });
});
