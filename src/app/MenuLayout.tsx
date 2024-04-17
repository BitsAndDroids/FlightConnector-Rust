import MenuItem from "@/components/nav/MenuItem";
import "./globals.css";
import { Titlebar } from "@/components/nav/titlebar";
import { Outlet } from "react-router-dom";

import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
export default function MenuLayout() {
  function openLogWindow() {
    const webview = new WebviewWindow("logWindow", {
      url: "/logs",
      title: "Logs",
    });
  }
  return (
    <div
      className={
        "w-screen h-screen min-h-screen flex flex-col bg-bitsanddroids-blue overflow-x-hidden overflow-hidden"
      }
    >
      <div className=" bg-bitsanddroids-blue mt-7 flex flex-row align-middle justify-start h-fit">
        <nav className={"text-white ml-4 bg-bitsanddroids-blue h-8"}>
          <MenuItem text={"Start"} href={"/"} />
          {/* <MenuItem text={"Settings"} href={"/options/settings"} /> */}
          <MenuItem text={"Outputs"} href={"/options/outputs"} />
          <button className="mx-2" onClick={() => openLogWindow()}>
            Logs
          </button>
        </nav>
      </div>
      <Titlebar />
      <div className="overflow-y-auto px-8">
        <Outlet />
      </div>
    </div>
  );
}
