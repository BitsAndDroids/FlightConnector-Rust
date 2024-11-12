import { render } from "@testing-library/react";
import { describe, test, expect, beforeAll } from "vitest";
import { CustomEvents } from "./CustomEvents";
import { setupTauriInternalMocks } from "@/tests/testUtils";

describe("CustomEvents", () => {
  beforeAll(() => {
    setupTauriInternalMocks();
  });
  test("renders without crashing", () => {
    const { container } = render(<CustomEvents />);
    expect(container).toBeTruthy();
  });
});
