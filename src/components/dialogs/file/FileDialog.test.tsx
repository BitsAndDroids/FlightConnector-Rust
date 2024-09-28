import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { FileDialog } from "./FileDialog";

describe("FileDialog", () => {
  test("renders without crashing", () => {
    const { container } = render(
      <FileDialog
        message={""}
        onConfirm={function (input?: string): void {
          throw new Error("Function not implemented.");
        }}
      />,
    );
    expect(container).toBeTruthy();
  });
});
