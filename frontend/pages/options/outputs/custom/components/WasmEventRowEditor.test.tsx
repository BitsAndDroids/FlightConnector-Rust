import { render } from "@testing-library/react";
import { WasmEventRowEditor } from "./WasmEventRowEditor";
import { describe, expect, test } from "vitest";
import { WASMEvent } from "#model/WASMEvent.js";

describe("WasmEventRowEditor", () => {
  //
  test("renders correctly", () => {
    const wasmEvent: WASMEvent = {
      id: 0,
      action: "",
      action_text: "",
      action_type: "",
      output_format: "",
      update_every: 0,
      min: 0,
      max: 0,
      value: 0,
      offset: 0,
      plane_or_category: [],
      made_by: "",
    };
    const { container } = render(
      <WasmEventRowEditor
        originalEvent={wasmEvent}
        onEventChanged={function (event: WASMEvent): void {
          throw new Error("Function not implemented.");
        }}
        toggleOpen={function (): void {
          throw new Error("Function not implemented.");
        }}
      />,
    );
    expect(container).toBeTruthy();
  });
});
