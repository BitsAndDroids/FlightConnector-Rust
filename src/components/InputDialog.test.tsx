import { screen, render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import InputDialog from "./InputDialog";
import InfoWindow from "./InfoWindow";

describe("InputDialog", () => {
  test("renders InputDialog component", async () => {
    const { container } = render(
      <InputDialog
        message={"test_message"}
        onConfirm={function (input?: string): void {
          throw new Error("Function not implemented.");
        }}
      />,
    );
    expect(container).toBeTruthy();
  });

  test("renders InputDialog component with docs_url", async () => {
    render(
      <InputDialog
        message={"test_message"}
        InfoWindow={<InfoWindow message={"test_message"} docs_url="test.com" />}
        onConfirm={function (input?: string): void {
          throw new Error("Function not implemented.");
        }}
      />,
    );
    const iconElement = await screen.findByTestId("icon_info");
    const openDocsElement = await screen.findByTestId("open_docs");
    expect(iconElement).toBeInTheDocument();
    expect(openDocsElement).toBeInTheDocument();
  });
});
