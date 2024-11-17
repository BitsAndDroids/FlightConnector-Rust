import { describe, expect, test } from "vitest";
import { OutputSelectRows } from "./OutputSelectRows";
import { render } from "@testing-library/react";
import { Output } from "@/model/Output";

describe("OutputSelectRows", () => {
  const mockOutputs = [
    {
      id: 1,
      selected: false,
      metric: "percentage",
      simvar: "test",
      cb_text: "test",
      category: "test",
      update_every: 0.0,
      output_type: "output",
    },
    {
      id: 2,
      selected: false,
      metric: "percentage",
      simvar: "test",
      cb_text: "test",
      category: "test",
      update_every: 0.0,
      output_type: "output",
    },
  ];
  test("renders without crashing", () => {
    // Test goes here
    const { container } = render(
      <OutputSelectRows
        outputs={mockOutputs}
        dialogOpen={false}
        toggleOutput={(_output: Output) => {}}
      />,
    );
    expect(container).toBeTruthy();
  });

  test("Rowcount is equal to output count", () => {
    // Test goes here
    const { container } = render(
      <OutputSelectRows
        outputs={mockOutputs}
        dialogOpen={false}
        toggleOutput={(_output: Output) => {}}
      />,
    );
    expect(container).toBeTruthy();
    const checkboxes = container.querySelectorAll("input[name='checked']");
    expect(checkboxes.length).toBe(2);
  });
});
