import { describe, test, expect } from "vitest";
import { WasmEventRow } from "./WasmEventRow";
import { render, waitFor } from "@testing-library/react";
import { MockWasmEvent } from "@/mocks/MockWasmEvent";
import { WASMEvent } from "#model/WASMEvent.js";

describe("WasmEventRow", () => {
  test("should render without crashing", () => {
    const { container } = render(
      <WasmEventRow
        event={MockWasmEvent}
        index={0}
        onEventChanged={function (event: WASMEvent): void {
          throw new Error("Function not implemented.");
        }}
      />,
    );
    expect(container).toBeTruthy();
  });

  test("should open editor on click", async () => {
    const { getByTestId } = render(
      <WasmEventRow
        event={MockWasmEvent}
        index={0}
        onEventChanged={function (event: WASMEvent): void {
          throw new Error("Function not implemented.");
        }}
      />,
    );
    await waitFor(() => {
      const row = getByTestId("wasm_event_row");
      row.click();
      const editor = getByTestId("wasm_event_row_editor");
      expect(editor).toHaveClass("max-h-screen");
    });
  });

  test("should close editor on click", async () => {
    const { getByTestId } = render(
      <WasmEventRow
        event={MockWasmEvent}
        index={0}
        onEventChanged={function (event: WASMEvent): void {}}
      />,
    );
    await waitFor(() => {
      getByTestId("wasm_event_row").click();
      getByTestId("btn_save_wasm").click();
      expect(getByTestId("wasm_event_row_editor")).toHaveClass("max-h-0");
    });
  });
});
