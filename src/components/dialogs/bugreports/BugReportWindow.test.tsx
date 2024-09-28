import { describe, test, expect } from "vitest";
import { BugReportWindow } from "./BugReportWindow";
import { render } from "@testing-library/react";

describe("BugReportWindow", async () => {
  test("renders without crashing", async () => {
    const { container } = render(
      <BugReportWindow
        closeWindow={function (): void {
          throw new Error("Function not implemented.");
        }}
      />,
    );
    expect(container).toBeTruthy();
  });
});
