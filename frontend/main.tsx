import React from "react";
import ConnectionPage from "./pages/connection_page/ConnectionPage";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import * as ReactDOM from "react-dom/client";
import MenuLayout from "./pages/MenuLayout";
import OutputsPage from "./pages/options/outputs/OutputsPage";
import { LogPage } from "./pages/logs/LogPage";
import SettingsPage from "./pages/options/settings/SettingsPage";
import { PresetManagerPage } from "./pages/options/settings/PresetManagerPage";
import { CustomEvents } from "./pages/options/outputs/custom/CustomEvents";
import { RunStateContextProvider } from "#context/RunStateContext.js";
const router = createBrowserRouter([
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
]);
ReactDOM.createRoot(document.getElementById("root")! as HTMLElement).render(
  <React.StrictMode>
    <RunStateContextProvider>
      <RouterProvider router={router} />
    </RunStateContextProvider>
  </React.StrictMode>,
);
