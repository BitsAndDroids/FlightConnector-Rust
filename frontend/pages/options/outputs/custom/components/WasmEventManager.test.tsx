import { render } from "@testing-library/react";
import { beforeEach, describe, expect, test } from "vitest";
import { WasmEventManager } from "./WasmEventManager";
import { getMockWasmEvents } from "@/mocks/MockWasmEvent";
import { setupTauriInternalMocks } from "#tests/testUtils.js";

describe("WasmEventManager", () => {
  beforeEach(() => {
    setupTauriInternalMocks();
  });
  test("should render without crashing", () => {
    const { container } = render(<WasmEventManager events={[]} />);
    expect(container).toBeTruthy();
  });

  test("should render a list of events", () => {
    const events = getMockWasmEvents(10);
    const { getAllByTestId } = render(<WasmEventManager events={events} />);
    expect(getAllByTestId("wasm_event_row").length).toBe(10);
  });
});
