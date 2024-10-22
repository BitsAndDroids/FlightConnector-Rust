import { describe, test, expect, vi, beforeAll } from "vitest";
import { RunComponent } from "./RunComponent";
import { render } from "@testing-library/react";
import { setupTauriInternalMocks } from "@/tests/testUtils";

describe("RunComponent", () => {
  beforeAll(() => {
    setupTauriInternalMocks();
  });
  test("renders RunComponent component", async () => {
    const { container } = render(<RunComponent />);
    expect(container).toBeTruthy();
  });
});
