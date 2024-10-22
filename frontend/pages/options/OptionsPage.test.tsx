import { describe, test, expect } from "vitest";
import OptionsPage from "./OptionsPage";
import { render } from "@testing-library/react";

describe("OptionsPage", () => {
  test("renders without crashing", () => {
    // Test goes here
    const { container } = render(<OptionsPage />);
    expect(container).toBeTruthy();
  });
});
