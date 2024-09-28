import { render } from "@testing-library/react";
import { describe, vi, expect, test, beforeAll } from "vitest";
import OutputsPage from "./OutputsPage";
import { setupTauriInternalMocks } from "@/tests/testUtils";

vi.mock("./OutputsPage", async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import("./OutputsPage")>()),
    saveBundle: vi.fn(),
  };
});

describe("OutputsPage", async () => {
  beforeAll(() => {
    setupTauriInternalMocks();
  });
  test("renders without crashing", async () => {
    const container = render(<OutputsPage />);
    expect(container).toBeTruthy();
  });
});
