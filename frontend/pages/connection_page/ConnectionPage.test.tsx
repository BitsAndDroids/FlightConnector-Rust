import { beforeAll, describe, expect, test } from "vitest";
import ConnectionPage from "./ConnectionPage";
import { render } from "@testing-library/react";
import { setupTauriInternalMocks } from "@/tests/testUtils";

describe("HomePage", () => {
  beforeAll(() => {
    setupTauriInternalMocks();
  });
  test("renders without crashing", () => {
    const { container } = render(<ConnectionPage />);
    expect(container).toBeTruthy();
  });
});
