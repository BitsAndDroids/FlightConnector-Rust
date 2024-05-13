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
        console.log("here we go");
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
          className="titlebar-button cursor-pointer"
          id="titlebar-minimize"
          onClick={onMinimize}
        >
          <img
            src="https://api.iconify.design/mingcute:minimize-fill.svg?color=%23ffffff"
            className={"fill-white"}
            alt="minimize"
          />
        </div>
        <div
          className="titlebar-button fill-amber-50 cursor-pointer"
          id="titlebar-maximize"
          onClick={onMaximize}
        >
          <img
            src="https://api.iconify.design/mdi:window-maximize.svg?color=%23ffffff"
            className={"fill-white"}
            alt="maximize"
          />
        </div>
        <div
          className="titlebar-button cursor-pointer"
          id="titlebar-close"
          onClick={onClose}
        >
          <img
            src="https://api.iconify.design/mdi:close.svg?color=%23ffffff"
            alt="close"
            className={"fill-amber-50"}
          />
        </div>
      </div>
    </Suspense>
  );
};
