import { describe, test, expect } from "vitest";
import BundleInfo from "./BundleInfo";
import { render } from "@testing-library/react";

describe("BundleInfo", () => {
  test("renders BundleInfo component", async () => {
    const { container } = render(<BundleInfo />);
    expect(container).toBeTruthy();
  });
});
