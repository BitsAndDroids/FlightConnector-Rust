import { describe, test, expect, beforeEach } from "vitest";
import { PresetManager } from "./PresetManager";
import { render } from "@testing-library/react";
import { setupTauriInternalMocks } from "@/tests/testUtils";

describe("PresetManager", async () => {
  beforeEach(() => {
    setupTauriInternalMocks();
  });
  test("renders without crashing", async () => {
    const { container } = render(<PresetManager />);
    expect(container).toBeTruthy();
  });
});
