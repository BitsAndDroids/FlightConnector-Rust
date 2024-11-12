import { fireEvent, render, waitFor } from "@testing-library/react";
import { WasmEventRowEditor } from "./WasmEventRowEditor";
import { beforeEach, describe, expect, test } from "vitest";
import { WASMEvent } from "#model/WASMEvent.js";
import { setupTauriInternalMocks } from "#tests/testUtils.js";

describe("WasmEventRowEditor", () => {
  //
  beforeEach(() => {
    setupTauriInternalMocks();
  });
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
        onEventDeleted={function (id: number): void {
          throw new Error("Function not implemented.");
        }}
      />,
    );
    expect(container).toBeTruthy();
  });

  test("Should update state when inputs change", async () => {
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
    const { getByLabelText, getByTestId } = render(
      <WasmEventRowEditor
        originalEvent={wasmEvent}
        onEventChanged={function (event: WASMEvent): void {
          throw new Error("Function not implemented.");
        }}
        toggleOpen={function (): void {
          throw new Error("Function not implemented.");
        }}
        onEventDeleted={function (id: number): void {
          throw new Error("Function not implemented.");
        }}
      />,
    );

    // const actionInput = getByLabelText("Action");
    // const actionTextInput = getByLabelText("Action Text");
    // const actionTypeInput = getByLabelText("Action Type");
    // const outputFormatInput = getByLabelText("Output Format");
    // const updateEveryInput = getByLabelText("Update Every");
    // const minInput = getByLabelText("Min");
    // const maxInput = getByLabelText("Max");
    // const valueInput = getByLabelText("Value");
    // const offsetInput = getByLabelText("Offset");
    // const planeOrCategoryInput = getByLabelText("Plane or Category");
    // const madeByInput = getByLabelText("Made By");
    // expect(idInput).toBeTruthy();
    // expect(actionInput).toBeTruthy();
    // expect(actionTextInput).toBeTruthy();
    // expect(actionTypeInput).toBeTruthy();
    // expect(outputFormatInput).toBeTruthy();
    // expect(updateEveryInput).toBeTruthy();
    // expect(minInput).toBeTruthy();
    // expect(maxInput).toBeTruthy();
    // expect(valueInput).toBeTruthy();
    // expect(offsetInput).toBeTruthy();
    // expect(planeOrCategoryInput).toBeTruthy();
    // expect(madeByInput).toBeTruthy();
    const idInput = getByTestId("input_id");
    fireEvent.change(idInput, { target: { value: "3468" } });
    await waitFor(() => {
      expect((idInput as HTMLInputElement).value).toBe("3468");
    });

    const actionInput = getByTestId("input_action");
    fireEvent.change(actionInput, { target: { value: "action" } });
    expect((actionInput as HTMLInputElement).value).toBe("action");

    const actionTextInput = getByTestId("input_action_text");
    fireEvent.change(actionTextInput, { target: { value: "test_text" } });
    expect((actionTextInput as HTMLInputElement).value).toBe("test_text");

    const actionTypeInput = getByTestId("select_action_type");
    fireEvent.change(actionTypeInput, { target: { value: "input" } });
    expect((actionTypeInput as HTMLInputElement).value).toBe("input");

    // fireEvent.change(actionInput, { target: { value: "action" } });
    // fireEvent.change(actionTextInput, { target: { value: "test_text" } });
  });
});
