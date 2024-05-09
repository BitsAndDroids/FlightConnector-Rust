import { Titlebar } from "@/components/nav/titlebar";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { Outlet } from "react-router-dom";
import { TopMenuItem } from "@/components/nav/TopMenuItem";
import { FileDialog } from "../FileDialog";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { ConnectorSettingsHandler } from "@/utils/connectorSettingsHandler";
export const MainMenu: React.FC = () => {
  const connectorSettingsHandler = new ConnectorSettingsHandler();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [communityFolderPath, setCommunityFolderPath] = useState<string>("");
  const openWindow = async (windowName: string, url: string) => {
    new WebviewWindow(windowName, {
      url: `/${url}`,
      title: windowName,
    });
  };
  function openLogWindow() {
    new WebviewWindow("logWindow", {
      url: "/logs",
      title: "Logs",
    });
  }
  const outputMenuItems = [
    { title: "Bundle settings", route: "/options/outputs", active: true },
    {
      title: "Custom output settings",
      route: "/options/outputs/custom",
      active: true,
    },
  ];
  const settingsMenuItems = [
    {
      title: "Connection settings",
      action: () => openWindow("settings", "options/settings"),
      active: true,
    },
    {
      title: "Manage presets",
      route: "/options/preset-manager",
      active: true,
    },
    { title: "Manage presets", route: "/options/settings/presets" },
    {
      title: "Install WASM",
      action: () => openWASMDialog(),
      active: true,
    },
  ];

  const openWASMDialog = async () => {
    const savedPath = await connectorSettingsHandler.getCommunityFolderPath();
    if (savedPath) {
      setCommunityFolderPath(savedPath);
    }
    setDialogOpen(true);
  };
  const installWasm = async (dirResult?: string) => {
    setDialogOpen(false);
    if (!dirResult) return;
    console.log("installing wasm to ", dirResult);
    await connectorSettingsHandler.setCommunityFolderPath(dirResult);
    invoke("install_wasm", { path: dirResult });
    await connectorSettingsHandler.setWASMModulePath(
      `${dirResult}\\BitsAndDroidsModule`,
    );
  };

  return (
    <>
      {dialogOpen && (
        <FileDialog
          message="Please select the MFS community folder"
          onConfirm={(input?: string) => installWasm(input)}
          setDialogOpen={setDialogOpen}
          value={communityFolderPath}
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
              text={"Events"}
              href={"/options/outputs"}
              subMenuItems={outputMenuItems}
            />
            <button className="mx-2 " onClick={() => openLogWindow()}>
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
