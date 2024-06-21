import InfoWindow from "@/components/InfoWindow";
import { Input } from "@/components/elements/Input";
import { ConnectorSettingsHandler } from "@/utils/connectorSettingsHandler";
import { ConnectorSettings } from "@/utils/models/ConnectorSettings";
import { useEffect, useState } from "react";
import { FileDialog } from "@/components/FileDialog";
import { changeLaunchWhenSimStarts } from "./services/LaunchService";

const SettingsPage = () => {
  const [connectorSettings, setConnectorSettings] = useState<ConnectorSettings>(
    {
      use_trs: false,
      launch_when_sim_starts: false,
    },
  );
  const [communityFolderVisible, setCommunityFolderVisible] = useState(false);
  const [communityFolderPath, setCommunityFolderPath] = useState<string | null>(
    null,
  );
  const [initialized, setInitialized] = useState(false);

  const connectorSettingsHandler = new ConnectorSettingsHandler();

  useEffect(() => {
    const initSettings = async () => {
      let savedSettings = await connectorSettingsHandler.getConnectorSettings();
      if (!savedSettings) {
        return;
      }
      setCommunityFolderPath(
        await connectorSettingsHandler.getCommunityFolderPath(),
      );
      if (savedSettings.launch_when_sim_starts === undefined) {
        savedSettings.launch_when_sim_starts = false;
      }
      if (savedSettings.use_trs === undefined) {
        savedSettings.use_trs = false;
      }
      setConnectorSettings(savedSettings);
    };
    initSettings();
    setInitialized(true);
  }, []);

  useEffect(() => {
    saveSettings();
  }, [connectorSettings]);

  const onSettingsChange = async (
    key: keyof ConnectorSettings,
    value: unknown,
  ) => {
    if (key === "use_trs") {
      if (typeof value === "boolean")
        setConnectorSettings({ ...connectorSettings, use_trs: value });
    }
    if (key === "launch_when_sim_starts") {
      if (typeof value === "boolean") {
        const communityFolderPresent =
          await connectorSettingsHandler.getCommunityFolderPath();
        if (!communityFolderPresent) {
          setCommunityFolderVisible(true);
          return;
        }
        setConnectorSettings({
          ...connectorSettings,
          launch_when_sim_starts: value,
        });

        changeLaunchWhenSimStarts(value);
      }
    }
  };

  const saveSettings = async () => {
    if (!initialized) return;
    await connectorSettingsHandler.setConnectorSettings(connectorSettings);
    console.log("saved settings", connectorSettings);
  };

  const setCommunityFolderFromLaunchSetting = async (
    folderPath: string | undefined,
  ) => {
    setCommunityFolderVisible(false);
    if (!folderPath) {
      console.log("no folder path");
      return;
    }
    await connectorSettingsHandler.setCommunityFolderPath(folderPath);
    changeLaunchWhenSimStarts(true);
    setConnectorSettings({
      ...connectorSettings,
      launch_when_sim_starts: true,
    });
    setCommunityFolderPath(folderPath);
  };

  return (
    <div className="p-2 px-4 bg-bitsanddroids-blue h-screen w-screen">
      {communityFolderVisible && (
        <FileDialog
          message="Select the community folder"
          value={communityFolderPath || ""}
          onConfirm={async (folderPath) => {
            setCommunityFolderFromLaunchSetting(folderPath);
          }}
        />
      )}
      <div className="mt-10 flex flex-row align-center">
        <h1
          className={"text-2xl font-bold tracking-tight text-white sm:text-4xl"}
        >
          Settings
        </h1>
      </div>
      <div className="bg-white rounded-md mt-4 p-4">
        <Input
          label="Use terminal ready signal"
          type="checkbox"
          onChange={(val) => onSettingsChange("use_trs", val)}
          value={connectorSettings.use_trs}
          infoWindow={
            <InfoWindow
              docs_url="https://bitsanddroids.github.io/FlightConnector-Rust/ch05-00-settings.html#enable-trs"
              message="The terminal ready signal can be used to force a reset when the connector initializes a connection with a microcontroller. Depending on your connected devices it might be nescesarry to order your devices to work with the resets."
            />
          }
        />
        <Input
          label="Launch when sim starts"
          type="checkbox"
          value={connectorSettings.launch_when_sim_starts}
          onChange={(val) => onSettingsChange("launch_when_sim_starts", val)}
          infoWindow={
            <InfoWindow
              docs_url="https://bitsanddroids.github.io/FlightConnector-Rust/ch05-00-settings.html#launch-when-sim-starts"
              message="When enabled, the connector will automatically start when the simulator starts."
            />
          }
        />
      </div>
    </div>
  );
};

export default SettingsPage;
