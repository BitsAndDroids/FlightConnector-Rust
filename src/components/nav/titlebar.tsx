"use client";
import { Window } from "@tauri-apps/api/window";
import React, { Suspense, useEffect, useState } from "react";

export const Titlebar: React.FC = () => {
  const [appWindow, setAppWindow] = useState<Window>();
  useEffect(() => {
    const fetchAppWindow = async () => {
      try {
        import("@tauri-apps/api/window").then((tauri) =>
          setAppWindow(new Window("bits-and-droids-connector")),
        );
      } catch (e) {
        console.error(e);
      }
    };

    fetchAppWindow();
  }, []);

  const onMinimize = () => {
    appWindow && appWindow.minimize();
  };

  const onMaximize = () => {
    appWindow && appWindow.toggleMaximize();
  };

  const onClose = () => {
    appWindow && appWindow.close();
  };

  return (
    <Suspense>
      {" "}
      <div data-tauri-drag-region className="titlebar bg-bitsanddroids-blue">
        <div
          className="titlebar-button"
          id="titlebar-minimize"
          onClick={onMinimize}
        >
          <img
            src="https://api.iconify.design/mdi:window-minimize.svg?color=%23f0f0f0"
            className={"fill-amber-50"}
            alt="minimize"
          />
        </div>
        <div
          className="titlebar-button fill-amber-50"
          id="titlebar-maximize"
          onClick={onMaximize}
        >
          <img
            src="https://api.iconify.design/mdi:window-maximize.svg?color=%23f0f0f0"
            className={"fill-amber-50"}
            alt="maximize"
          />
        </div>
        <div className="titlebar-button" id="titlebar-close" onClick={onClose}>
          <img
            src="https://api.iconify.design/mdi:close.svg?color=%23f0f0f0"
            alt="close"
            className={"fill-amber-50"}
          />
        </div>
      </div>
    </Suspense>
  );
};
