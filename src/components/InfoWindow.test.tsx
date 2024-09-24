import { beforeAll, describe, expect, test, vi } from "vitest";
import InfoWindow from "./InfoWindow";
import { screen, render, fireEvent } from "@testing-library/react";
import { clearMocks } from "@tauri-apps/api/mocks";
import { randomFillSync } from "crypto";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

describe("InfoWindow", () => {
  const mockInstance = {
    createWebviewWindow: vi.fn().mockResolvedValue([]),
  };

  beforeAll(() => {
    clearMocks();
    Object.defineProperty(window, "crypto", {
      value: {
        // @ts-ignore
        getRandomValues: (buffer) => {
          return randomFillSync(buffer);
        },
      },
    });
    global.window.__TAURI_INTERNALS__ = {
      invoke: vi.fn().mockResolvedValue([]),
    };
  });
  test("renders InfoWindow component", async () => {
    const { container } = render(<InfoWindow message={"test_message"} />);
    expect(container).toBeTruthy();
  });

  test("renders InfoWindow component without docs_url", async () => {
    render(<InfoWindow message={"test_message"} />);
    const iconElement = await screen.findByTestId("icon_info");
    const openDocsElement = screen.queryByTestId("open_docs");
    expect(iconElement).toBeInTheDocument();
    expect(openDocsElement).toBeNull();
  });

  test("renders InfoWindow component with docs_url", async () => {
    render(
      <InfoWindow message={"test_message"} docs_url={"https://google.com"} />,
    );
    const iconElement = await screen.findByTestId("icon_info");
    const openDocsElement = await screen.findByTestId("open_docs");
    expect(iconElement).toBeInTheDocument();
    expect(openDocsElement).toBeInTheDocument();
  });

  test("should open docs when docs link is clicked", async () => {
    const spy = vi.spyOn(mockInstance, "createWebviewWindow");

    render(
      <InfoWindow
        message="Test message"
        docs_url="http://example.com/docs"
        createWebviewWindow={mockInstance.createWebviewWindow}
      />,
    );

    const docsLink = screen.getByTestId("open_docs");
    fireEvent.click(docsLink);

    expect(spy).toHaveBeenCalledWith("docs", {
      url: "http://example.com/docs",
      title: "docs",
    });
  });
});
