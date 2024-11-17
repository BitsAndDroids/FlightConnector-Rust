import { describe, test, expect } from "vitest";
import BundleRow from "./BundleRow";
import { render } from "@testing-library/react";
import { Bundle } from "@/model/Bundle";
import { mockBundle } from "@/mocks/MockBundle";

describe("BundleRow", () => {
  test("renders without crashing", () => {
    const { container } = render(
      <BundleRow
        bundle={mockBundle}
        setSelectedBundle={function (bundle: Bundle): void {
          throw new Error("Function not implemented.");
        }}
        setEditBundle={function (bundle: Bundle): void {
          throw new Error("Function not implemented.");
        }}
        deleteBundle={function (bundle: Bundle): void {
          throw new Error("Function not implemented.");
        }}
      />,
    );
    expect(container).toBeTruthy();
  });
});
