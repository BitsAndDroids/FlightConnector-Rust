import { render, screen } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import ConnectionPage from "./pages/connection_page/ConnectionPage";
import MenuLayout from "./pages/MenuLayout";
import OutputsPage from "./pages/options/outputs/OutputsPage";
import { LogPage } from "./pages/logs/LogPage";
import SettingsPage from "./pages/options/settings/SettingsPage";
import { PresetManagerPage } from "./pages/options/settings/PresetManagerPage";
import { CustomEvents } from "./pages/custom_output_page/CustomEvents";
import { setupTauriInternalMocks } from "./tests/testUtils";

const routes = [
  {
    path: "/",
    element: <MenuLayout />,
    children: [{ path: "/", element: <ConnectionPage /> }],
  },
  {
    path: "/options/outputs",
    element: <MenuLayout />,
    children: [{ path: "/options/outputs", element: <OutputsPage /> }],
  },
  {
    path: "/options/outputs/custom",
    element: <MenuLayout />,
    children: [{ path: "/options/outputs/custom", element: <CustomEvents /> }],
  },
  {
    path: "/options/preset-manager",
    element: <MenuLayout />,
    children: [
      { path: "/options/preset-manager", element: <PresetManagerPage /> },
    ],
  },
  {
    path: "/options/settings",
    element: <SettingsPage />,
  },
  {
    path: "/logs",
    element: <LogPage />,
  },
];

describe("Router", () => {
  beforeEach(() => {
    setupTauriInternalMocks();
  });
  it("should render the homepage", () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/"],
    });

    render(<RouterProvider router={router} />);

    expect(screen.getByTestId("home_page")).toBeInTheDocument();
  });

  it("should render the OutputsPage", () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/options/outputs"],
    });

    render(<RouterProvider router={router} />);

    expect(screen.getByTestId("outputs_page")).toBeInTheDocument();
  });

  it("should render the CustomEvents page", () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/options/outputs/custom"],
    });
    render(<RouterProvider router={router} />);
    expect(screen.getByTestId("custom_event_page")).toBeInTheDocument();
  });

  // More test cases for other routes...
});
