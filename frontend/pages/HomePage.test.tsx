import { beforeAll, describe, expect, test, vi } from "vitest";
import HomePage from "./HomePage";
import { render } from "@testing-library/react";
import { setupTauriInternalMocks } from "@/tests/testUtils";

describe("HomePage", () => {
  beforeAll(() => {
    setupTauriInternalMocks();
  });
  test("renders without crashing", () => {
    const { container } = render(<HomePage />);
    expect(container).toBeTruthy();
  });
});
