import { describe, test, expect, beforeAll, vi } from "vitest";
import { LogPage } from "./LogPage";
import { render } from "@testing-library/react";
import { setupTauriInternalMocks } from "@/tests/testUtils";

describe("LogPage", () => {
  beforeAll(() => {
    setupTauriInternalMocks();
  });
  test("renders LogPage component", async () => {
    const { container } = render(<LogPage />);
    expect(container).toBeTruthy();
  });
});
