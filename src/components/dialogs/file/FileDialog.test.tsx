import { fireEvent, render, waitFor } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
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
  test("triggers confirm on click", () => {
    const onConfirm = vi.fn();
    const { getByTestId } = render(
      <FileDialog message={""} onConfirm={onConfirm} />,
    );
    const input = getByTestId("input_file");
    fireEvent.input(input, { target: { value: "test" } });
    getByTestId("btn_confirm").click();
    expect(onConfirm).toHaveBeenCalled();
  });

  test("sets the props value as selectedDirectory", () => {
    const onConfirm = vi.fn();
    const { getByTestId } = render(
      <FileDialog message={""} onConfirm={onConfirm} value={"test"} />,
    );
    const input = getByTestId("input_file");
    expect(input).toHaveValue("test");
  });

  test("sets error state if selectedDirectory is null", async () => {
    const onConfirm = vi.fn();
    const { getByTestId, getByText } = render(
      <FileDialog message={""} onConfirm={onConfirm} />,
    );
    getByTestId("btn_confirm").click();

    await waitFor(() => {
      expect(getByTestId("input_file")).toHaveClass("border-pink-300");
    });

    expect(onConfirm).not.toHaveBeenCalled();
  });
});
