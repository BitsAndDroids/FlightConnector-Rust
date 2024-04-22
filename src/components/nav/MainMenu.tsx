import { Titlebar } from "@/components/nav/titlebar";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { Outlet } from "react-router-dom";
import { TopMenuItem } from "@/components/nav/TopMenuItem";
import { FileDialog } from "../FileDialog";
import { useState } from "react";
export const MainMenu: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  function openLogWindow() {
    const webview = new WebviewWindow("logWindow", {
      url: "/logs",
      title: "Logs",
    });
  }
  const outputMenuItems = [
    { title: "Bundle settings", route: "/options/outputs", active: true },
    { title: "Custom output settings", route: "/options/outputs/output" },
  ];
  const settingsMenuItems = [
    { title: "Settings", route: "/options/settings" },
    { title: "Manage presets", route: "/options/settings/presets" },
    {
      title: "Install WASM",
      action: () => installWasm(),
      active: true,
    },
  ];
  const installWasm = async () => {
    setDialogOpen(true);
  };
  return (
    <>
      {dialogOpen && (
        <FileDialog
          message="Please select the MFS community folder"
          onConfirm={() => setDialogOpen(false)}
          setDialogOpen={setDialogOpen}
        />
      )}
      <div
        className={
          "w-screen h-screen min-h-screen flex flex-col bg-bitsanddroids-blue overflow-x-hidden overflow-hidden"
        }
      >
        <div className=" bg-bitsanddroids-blue w-screen mt-7 flex flex-row align-middle justify-start h-fit">
          <nav
            className={
              "text-white w-screen flex flex-row ml-4 bg-bitsanddroids-blue h-8"
            }
          >
            <TopMenuItem text={"Start"} href={"/"} />
            {/* <MenuItem text={"Settings"} href={"/options/settings"} /> */}
            <TopMenuItem
              text={"Settings"}
              href={"/options/settings"}
              subMenuItems={settingsMenuItems}
            />
            <TopMenuItem
              text={"Outputs"}
              href={"/options/outputs"}
              subMenuItems={outputMenuItems}
            />
            <button className="mx-2 mt-2" onClick={() => openLogWindow()}>
              Logs
            </button>
          </nav>
        </div>
        <Titlebar />
        <div className="overflow-y-auto px-8">
          <Outlet />
        </div>
      </div>
    </>
  );
};
