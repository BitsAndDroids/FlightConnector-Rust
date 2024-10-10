import { describe, expect, test } from "vitest";
import { WasmEventFilter } from "./WasmEventFilter";
import { render } from "@testing-library/react";
import { WasmEventFilterParams } from "../models/WasmEventFilter";

describe("WasmEventFilter", () => {
  test("should render without crashing", () => {
    const { container } = render(
      <WasmEventFilter
        filter={{
          query: "",
          type: "All",
          category: "All",
          madeBy: "All",
        }}
        setFilter={function (filter: WasmEventFilterParams): void {
          throw new Error("Function not implemented.");
        }}
      />,
    );
    expect(container).toBeTruthy();
  });
});
