import { render } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import OutputCategory from "./OutputCategory";
import { Output } from "@/model/Output";
import { Category } from "@/model/Category";

describe("OutputCategory", () => {
  const output: Output = {
    id: 123,
    category: "test_cat",
    simvar: "test_var",
    metric: "",
    update_every: 0,
    cb_text: "test_cat",
    output_type: "",
  };
  const category: Category = {
    name: "",
    outputs: [output],
  };
  test("renders without crashing", () => {
    const { container } = render(
      <OutputCategory
        category={category}
        toggleOutput={function (output: Output): void {
          throw new Error("Function not implemented.");
        }}
      />,
    );
    expect(container).toBeTruthy();
  });
  test("renders output", () => {
    const { getByText } = render(
      <OutputCategory
        category={category}
        toggleOutput={function (output: Output): void {
          throw new Error("Function not implemented.");
        }}
      />,
    );
    expect(getByText("test_var")).toBeTruthy();
  });
});
