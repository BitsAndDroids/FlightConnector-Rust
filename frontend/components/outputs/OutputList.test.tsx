import { describe, test, expect } from "vitest";
import OutputList from "./Outputlist";
import { render } from "@testing-library/react";
import { mockBundle } from "@/mocks/MockBundle";

describe("OutputList", () => {
  test("renders without crashing", async () => {
    const { container } = render(<OutputList bundle={mockBundle} />);
    expect(container).toBeTruthy();
  });

  test("reders the output list", async () => {
    const { getByTestId } = render(<OutputList bundle={mockBundle} />);
    expect(getByTestId("output_list")).toBeTruthy();
  });
});
