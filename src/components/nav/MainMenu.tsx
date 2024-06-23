import { Titlebar } from "@/components/nav/titlebar";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { Outlet } from "react-router-dom";
import { TopMenuItem } from "@/components/nav/TopMenuItem";
import { FileDialog } from "../FileDialog";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { ConnectorSettingsHandler } from "@/utils/connectorSettingsHandler";
import { generateLibrary } from "@/library/utils/CustomWasmGenerator";
import { UpdateWindow } from "../UpdateWindow";
import { hasReadLatestPatchNotes } from "@/utils/UpdateChecker";
export const MainMenu: React.FC = () => {
  const connectorSettingsHandler = new ConnectorSettingsHandler();
  const [installWASMDialogOpen, setInstallWASMDialogOpen] =
    useState<boolean>(false);
  const [generateLibraryDialogOpen, setGenerateLibraryDialogOpen] =
    useState<boolean>(false);
  const [communityFolderPath, setCommunityFolderPath] = useState<string>("");
  const [libraryFolderPath, setLibraryFolderPath] = useState<string>("");
  const [updateWindowOpen, setUpdateWindowOpen] = useState<boolean>(false);

  useEffect(() => {
    const checkForUpdates = async () => {
      const hasRead = await hasReadLatestPatchNotes();
      if (!hasRead.read) {
        connectorSettingsHandler.setLatestPatchNotesRead(hasRead.tag.tag);
        setUpdateWindowOpen(true);
      }
    };
    checkForUpdates();
  }, []);

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
  const eventMenuItems = [
    { title: "Bundle settings", route: "/options/outputs", active: true },
    {
      title: "Custom output settings",
      route: "/options/outputs/custom",
      active: true,
    },
    {
      title: "Generate library",
      action: () => openGenerateWASMLibrary(),
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
  const communityMenu = [
    {
      title: "Community projects",
      action: () => openCommunityProjectsWindow(),
      active: true,
    },
  ];

  const openCommunityProjectsWindow = () => {
    openWindow("Projects", "projects");
  };

  const openWASMDialog = async () => {
    const savedPath = await connectorSettingsHandler.getCommunityFolderPath();
    if (savedPath) {
      setCommunityFolderPath(savedPath);
    }
    setInstallWASMDialogOpen(true);
  };

  const openGenerateWASMLibrary = async (path?: string) => {
    const savedPath = await connectorSettingsHandler.getLibraryFolderPath();
    if (savedPath) {
      setLibraryFolderPath(savedPath);
    }
    setGenerateLibraryDialogOpen(true);
  };

  const installWasm = async (dirResult?: string) => {
    setInstallWASMDialogOpen(false);
    if (!dirResult) return;
    console.log("installing wasm to ", dirResult);
    await connectorSettingsHandler.setCommunityFolderPath(dirResult);
    invoke("install_wasm", { path: dirResult });
    await connectorSettingsHandler.setWASMModulePath(
      `${dirResult}\\BitsAndDroidsModule`,
    );
  };

  const generateWASMLibrary = async (dirResult?: string) => {
    setGenerateLibraryDialogOpen(false);
    if (!dirResult) return;
    console.log("generating wasm library to ", dirResult);
    await connectorSettingsHandler.setLibraryFolderPath(dirResult);
    generateLibrary(dirResult);
  };

  return (
    <>
      {updateWindowOpen && (
        <UpdateWindow closeWindow={() => setUpdateWindowOpen(false)} />
      )}
      {installWASMDialogOpen && (
        <FileDialog
          message="Please select the MFS community folder"
          onConfirm={(input?: string) => installWasm(input)}
          setDialogOpen={setInstallWASMDialogOpen}
          value={communityFolderPath}
        />
      )}
      {generateLibraryDialogOpen && (
        <FileDialog
          message="Please select the location where to save the library"
          onConfirm={(input?: string) => generateWASMLibrary(input)}
          setDialogOpen={setGenerateLibraryDialogOpen}
          value={libraryFolderPath}
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
              subMenuItems={eventMenuItems}
            />
            <TopMenuItem text="Community" subMenuItems={communityMenu} />
            <button className="mx-2 " onClick={() => openLogWindow()}>
              Logs
            </button>
            <TopMenuItem
              text={"Release notes"}
              action={() => setUpdateWindowOpen(true)}
              addToClassName="ml-2"
            />
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
