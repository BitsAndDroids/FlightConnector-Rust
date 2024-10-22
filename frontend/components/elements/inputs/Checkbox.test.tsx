import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  test("renders without crashing", async () => {
    const { container } = render(<Checkbox />);
    expect(container).toBeTruthy();
  });

  test("renders with the correct label", async () => {
    const { getByText } = render(<Checkbox label="Test Label" />);
    expect(getByText("Test Label:")).toBeTruthy();
  });

  test("passes onLight prop to label", async () => {
    const { getByText } = render(<Checkbox label="Test Label" onLight />);
    expect(getByText("Test Label:")).toHaveClass("text-gray-600");
  });

  test("onChange fires the correct function", async () => {
    let isChecked = false;
    const { getByTestId } = render(
      <Checkbox
        label="Test Label"
        onChange={() => {
          isChecked = !isChecked;
        }}
      />,
    );
    const checkbox = getByTestId("checkbox");
    checkbox.click();
    expect(isChecked).toBe(true);
  });
});
