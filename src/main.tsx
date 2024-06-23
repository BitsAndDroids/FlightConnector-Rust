import React from "react";
import HomePage from "./app/HomePage";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import * as ReactDOM from "react-dom/client";
import MenuLayout from "./app/MenuLayout";
import OutputsPage from "./app/options/outputs/OutputsPage";
import { LogPage } from "./app/logs/LogPage";
import SettingsPage from "./app/options/settings/SettingsPage";
import { PresetManagerPage } from "./app/options/settings/PresetManagerPage";
import { CustomEvents } from "./app/options/outputs/custom/CustomEvents";
import { ProjectWindow } from "./app/community/projects/ProjectWindow";
const router = createBrowserRouter([
  {
    path: "/",
    element: <MenuLayout />,
    children: [{ path: "/", element: <HomePage /> }],
  },
  {
    path: "projects",
    element: <ProjectWindow />,
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
    <RouterProvider router={router} />
  </React.StrictMode>,
);
