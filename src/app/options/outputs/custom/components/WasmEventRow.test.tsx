import { describe, test, expect } from "vitest";
import { WasmEventRow } from "./WasmEventRow";
import { render, waitFor } from "@testing-library/react";
import { MockWasmEvent } from "@/mocks/MockWasmEvent";

describe("WasmEventRow", () => {
  test("should render without crashing", () => {
    const { container } = render(
      <WasmEventRow event={MockWasmEvent} index={0} />,
    );
    expect(container).toBeTruthy();
  });

  test("should open editor on click", async () => {
    const { getByTestId } = render(
      <WasmEventRow event={MockWasmEvent} index={0} />,
    );
    const row = getByTestId("wasm_event_row");
    row.click();
    const editor = getByTestId("wasm_event_row_editor");
    await waitFor(() => {
      expect(editor).toHaveClass("max-h-screen");
    });
  });

  test("should close editor on click", async () => {
    const { getByTestId } = render(
      <WasmEventRow event={MockWasmEvent} index={0} />,
    );
    getByTestId("wasm_event_row").click();
    getByTestId("btn_save_wasm").click();
    await waitFor(() => {
      expect(getByTestId("wasm_event_row_editor")).toHaveClass("max-h-0");
    });
  });
});
