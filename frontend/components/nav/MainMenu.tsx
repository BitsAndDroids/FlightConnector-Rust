import { Titlebar } from "@/components/nav/titlebar";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { Outlet } from "react-router-dom";
import { TopMenuItem } from "@/components/nav/TopMenuItem";
import { FileDialog } from "../dialogs/file/FileDialog";
import { useContext, useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { ConnectorSettingsHandler } from "@/utils/connectorSettingsHandler";
import { generateLibrary } from "@/library/utils/CustomWasmGenerator";
import { UpdateWindow } from "../UpdateWindow";
import { hasReadLatestPatchNotes } from "@/utils/UpdateChecker";
import { BugReportWindow } from "../dialogs/bugreports/BugReportWindow";
import { PartnerDeviceSettings } from "#partner_devices/components/PartnerDeviceSettings";
export const MainMenu: React.FC = () => {
  const connectorSettingsHandler = useRef(new ConnectorSettingsHandler());
  const [installWASMDialogOpen, setInstallWASMDialogOpen] =
    useState<boolean>(false);
  const [generateLibraryDialogOpen, setGenerateLibraryDialogOpen] =
    useState<boolean>(false);
  const [communityFolderPath, setCommunityFolderPath] = useState<string>("");
  const [libraryFolderPath, setLibraryFolderPath] = useState<string>("");
  const [updateWindowOpen, setUpdateWindowOpen] = useState<boolean>(false);
  const [bugReportWindowOpen, setBugReportWindowOpen] =
    useState<boolean>(false);
  const [partnerDevicesOpen, setPartnerDevicesOpen] = useState<boolean>(false);
  useEffect(() => {
    const checkForUpdates = async () => {
      const hasRead = await hasReadLatestPatchNotes();
      if (!hasRead.read) {
        connectorSettingsHandler.current.setLatestPatchNotesRead(
          hasRead.tag.tag,
        );
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

  const openEventTestWindow = async () => {
    new WebviewWindow("eventTestWindow", {
      url: "/event-test",
      title: "Event Test",
    });
  };
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
    {
      title: "Partner devices",
      action: () => setPartnerDevicesOpen(true),
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
  const debugmenuItems = [
    { title: "Logs", action: () => openLogWindow(), active: true },
    { title: "Test events", action: () => openEventTestWindow(), active: true },
  ];

  const openWASMDialog = async () => {
    const savedPath =
      await connectorSettingsHandler.current.getCommunityFolderPath();
    if (savedPath) {
      setCommunityFolderPath(savedPath);
    }
    setInstallWASMDialogOpen(true);
  };

  const openGenerateWASMLibrary = async (path?: string) => {
    const savedPath =
      await connectorSettingsHandler.current.getLibraryFolderPath();
    if (savedPath) {
      setLibraryFolderPath(savedPath);
    }
    setGenerateLibraryDialogOpen(true);
  };

  const closePartnerDevicesOpen = (open: boolean) => {
    setPartnerDevicesOpen(open);
  };
  const installWasm = async (dirResult?: string) => {
    setInstallWASMDialogOpen(false);
    if (!dirResult) return;
    console.log("installing wasm to ", dirResult);
    await connectorSettingsHandler.current.setCommunityFolderPath(dirResult);
    invoke("install_wasm", { path: dirResult });
    await connectorSettingsHandler.current.setWASMModulePath(
      `${dirResult}\\BitsAndDroidsModule`,
    );
  };

  const generateWASMLibrary = async (dirResult?: string) => {
    setGenerateLibraryDialogOpen(false);
    if (!dirResult) return;
    console.log("generating wasm library to ", dirResult);
    await connectorSettingsHandler.current.setLibraryFolderPath(dirResult);
    generateLibrary(dirResult);
  };

  const closeBugReportWindow = () => {
    setBugReportWindowOpen(false);
  };

  return (
    <>
      {partnerDevicesOpen && (
        <PartnerDeviceSettings
          setDialogOpen={function (open: boolean): void {
            setPartnerDevicesOpen(open);
          }}
        />
      )}
      {bugReportWindowOpen && (
        <BugReportWindow closeWindow={closeBugReportWindow} />
      )}
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
          "w-screen h-fit min-h-screen min-w-[102%] flex flex-col bg-bitsanddroids-blue overflow-x-hidden overflow-hidden"
        }
        data-testid="main_menu"
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
            <TopMenuItem
              text={"Debug"}
              href={"/options/outputs"}
              subMenuItems={debugmenuItems}
            />
            <TopMenuItem
              text={"Release notes"}
              action={() => setUpdateWindowOpen(true)}
            />
          </nav>
        </div>
        <Titlebar />
        <div className="overflow-y-auto px-8">
          <Outlet />
        </div>
        <div className="bg-bitsanddroids-blue w-screen h-8"></div>
        <button
          onClick={() => setBugReportWindowOpen(true)}
          className="absolute bottom-10 right-10 bg-white p-2 rounded-full has-tooltip"
        >
          <span className="tooltip rounded shadow-lg p-1 bg-gray-100 text-red-500 -mt-12 -ml-[95px]">
            report a bug
          </span>
          <img
            src="https://api.iconify.design/streamline:bug-virus-document.svg?color=%23ad0314"
            className={"fill-amber-50"}
            alt="report a bug"
          />
        </button>
      </div>
    </>
  );
};
