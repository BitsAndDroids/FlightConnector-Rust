import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import BundleEditor from "./BundleEditor";
import { Output } from "@/model/Output";

describe("BundleEditor", () => {
  test("renders without crashing", () => {
    const { container } = render(
      <BundleEditor
        outputs={[]}
        dialogOpen={false}
        toggleOutput={function (output: Output): void {
          throw new Error("Function not implemented.");
        }}
      />,
    );
    expect(container).toBeTruthy();
  });
});
