import { screen, render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { ControllerSelect } from "./ControllerSelect";

describe("ControllerSelect", () => {
  test("renders ControllerSelect component", async () => {
    render(
      <ControllerSelect
        comPorts={[]}
        bundles={[]}
        setComPort={() => {}}
        setBundle={() => {}}
        removeRow={() => {}}
      />,
    );
    const controllerSelectElement = screen.getByTestId("controller_select");
    expect(controllerSelectElement).toBeInTheDocument();
  });
});
