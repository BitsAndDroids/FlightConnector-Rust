import { describe, expect, test } from "vitest";
import { render } from "@testing-library/react";
import { OutputSelectRow } from "./OutputSelectRow";
import { Output } from "@/model/Output";

describe("OutputSelectRow", () => {
  const mockOutput: Output = {
    id: 1,
    selected: false,
    metric: "percentage",
    simvar: "test",
    cb_text: "test",
    category: "test",
    update_every: 0.0,
    output_type: "output",
  };

  test("renders without crashing", () => {
    const { container } = render(
      <OutputSelectRow
        output={mockOutput}
        index={0}
        dialogOpen={false}
        toggleOutput={() => {}}
        changeUpdateRate={() => {}}
      />,
    );
    expect(container).toBeTruthy();
  });

  test("Sets tabIndex to -1 when dialog is open", () => {
    const { container } = render(
      <OutputSelectRow
        output={mockOutput}
        index={0}
        dialogOpen={true}
        toggleOutput={() => {}}
        changeUpdateRate={() => {}}
      />,
    );
    expect(container).toBeTruthy();
    const checkbox = container.querySelector("input[name='checked']");
    expect((checkbox as HTMLElement)?.tabIndex).toBe(-1);
  });

  test("Sets tabIndex to 1 when dialog is open", () => {
    const { container } = render(
      <OutputSelectRow
        output={mockOutput}
        index={0}
        dialogOpen={false}
        toggleOutput={() => {}}
        changeUpdateRate={() => {}}
      />,
    );
    expect(container).toBeTruthy();

    const checkbox = container.querySelector("input[name='checked']");
    expect((checkbox as HTMLElement)?.tabIndex).toBe(1);
  });
});
