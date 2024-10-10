import { describe, expect, test } from "vitest";
import { WasmEventFilter } from "./WasmEventFilter";
import { render } from "@testing-library/react";

describe("WasmEventFilter", () => {
  test("should render without crashing", () => {
    const { container } = render(<WasmEventFilter />);
    expect(container).toBeTruthy();
  });
});
