import { describe, test, expect, vi, beforeEach } from "vitest";
import { BugReportWindow } from "./BugReportWindow";
import { fireEvent, render, renderHook } from "@testing-library/react";
import { CustomEventHandler } from "@/utils/CustomEventHandler";

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
