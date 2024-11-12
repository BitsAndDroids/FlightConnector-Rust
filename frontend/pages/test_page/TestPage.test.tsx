import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TestPage } from "./TestPage";
import { invoke } from "@tauri-apps/api/core";

// Mock the tauri invoke function
vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn(),
}));

describe("TestPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly", () => {
    render(<TestPage />);

    expect(screen.getByText("Test Page")).toBeInTheDocument();
    expect(screen.getByTestId("input_id")).toBeInTheDocument();
    expect(screen.getByTestId("input_value")).toBeInTheDocument();
    expect(screen.getByText("Send")).toBeInTheDocument();
  });

  it("updates ID input value", () => {
    render(<TestPage />);
    const idInput: HTMLInputElement = screen.getByTestId("input_id");

    fireEvent.change(idInput, { target: { value: "123" } });

    expect(idInput.value).toBe("123");
  });

  it("updates Value input", () => {
    render(<TestPage />);
    const valueInput: HTMLInputElement = screen.getByTestId("input_value");

    fireEvent.change(valueInput, { target: { value: "456" } });

    expect(valueInput.value).toBe("456");
  });

  it("calls invoke with correct parameters when Send is clicked", async () => {
    render(<TestPage />);

    const idInput = screen.getByTestId("input_id");
    const valueInput = screen.getByTestId("input_value");
    const sendButton = screen.getByTestId("btn_send");

    fireEvent.change(idInput, { target: { value: "123" } });
    fireEvent.change(valueInput, { target: { value: "456" } });
    fireEvent.click(sendButton);

    expect(invoke).toHaveBeenCalledWith("send_debug_message", {
      message: { id: 123, value: 456 },
    });
  });

  it("handles empty input values", () => {
    render(<TestPage />);
    const sendButton = screen.getByText("Send");

    fireEvent.click(sendButton);

    expect(invoke).toHaveBeenCalledWith("send_debug_message", {
      message: { id: 0, value: 0 },
    });
  });
});
