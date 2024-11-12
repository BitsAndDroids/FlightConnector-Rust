import { ConnectorSettingsHandler } from "@/utils/connectorSettingsHandler";
import { invoke } from "@tauri-apps/api/core";
export const changeLaunchWhenSimStarts = async (value: boolean) => {
  const connectorSettingsHandler = new ConnectorSettingsHandler();
  const communityFolderPath =
    await connectorSettingsHandler.getCommunityFolderPath();
  if (communityFolderPath === null) {
    return;
  }

  const localCachePath = communityFolderPath?.replace(
    "\\Packages\\Community",
    "",
  );
  const exeXMLPath = `${localCachePath}\\exe.xml`;
  value
    ? enableLaunchWhenSimStarts(exeXMLPath)
    : disableLaunchWhenSimStarts(exeXMLPath);
};

const enableLaunchWhenSimStarts = async (xmlPath: string) => {
  const result = await invoke("toggle_run_on_sim_launch", {
    enable: true,
    exeXmlPath: xmlPath,
  });
};

const disableLaunchWhenSimStarts = async (xmlPath: string) => {
  const result = await invoke("toggle_run_on_sim_launch", {
    enable: false,
    exeXmlPath: xmlPath,
  });
};
