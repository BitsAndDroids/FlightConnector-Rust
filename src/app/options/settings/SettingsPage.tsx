import InfoWindow from "@/components/InfoWindow";
import { ConnectorSettingsHandler } from "@/utils/connectorSettingsHandler";
import { ConnectorSettings } from "@/utils/models/ConnectorSettings";
import { useEffect, useRef, useState } from "react";
import { changeLaunchWhenSimStarts } from "./services/LaunchService";
import { HeaderDivider } from "@/components/elements/HeaderDivider";
import { FileDialog } from "@/components/dialogs/file/FileDialog";
import { Input } from "@/components/elements/inputs/Input";

const saveSettings = async (
  initialized: boolean,
  connectorSettingsHandler: ConnectorSettingsHandler,
  connectorSettings: ConnectorSettings,
) => {
  if (!initialized) return;
  await connectorSettingsHandler.setConnectorSettings(connectorSettings);
  console.log("saved settings", connectorSettings);
};
const SettingsPage = () => {
  const [connectorSettings, setConnectorSettings] = useState<ConnectorSettings>(
    {
      use_trs: false,
      adc_resolution: 1023,
      launch_when_sim_starts: false,
      installed_wasm_version: "0.0.0",
      send_every_ms: 6,
    },
  );
  const [communityFolderVisible, setCommunityFolderVisible] = useState(false);
  const [communityFolderPath, setCommunityFolderPath] = useState<string | null>(
    null,
  );
  const [initialized, setInitialized] = useState(false);

  const connectorSettingsHandler = useRef(new ConnectorSettingsHandler());

  useEffect(() => {
    const initSettings = async () => {
      let savedSettings =
        await connectorSettingsHandler.current.getConnectorSettings();
      if (!savedSettings) {
        return;
      }
      setCommunityFolderPath(
        await connectorSettingsHandler.current.getCommunityFolderPath(),
      );
      if (!savedSettings.launch_when_sim_starts) {
        savedSettings.launch_when_sim_starts = false;
      }
      if (!savedSettings.use_trs) {
        savedSettings.use_trs = false;
      }
      if (!savedSettings.adc_resolution) {
        savedSettings.adc_resolution = 1023;
      }
      if (!savedSettings.send_every_ms) {
        savedSettings.send_every_ms = 6;
      }
      setConnectorSettings(savedSettings);
    };
    initSettings();
    setInitialized(true);
  }, []);

  useEffect(() => {
    saveSettings(
      initialized,
      connectorSettingsHandler.current,
      connectorSettings,
    );
  }, [connectorSettings, initialized]);

  const onSettingsChange = async (
    key: keyof ConnectorSettings,
    value: unknown,
  ) => {
    console.log(key, value);
    if (key === "use_trs") {
      if (typeof value === "boolean")
        setConnectorSettings({ ...connectorSettings, use_trs: value });
    }
    if (key === "launch_when_sim_starts") {
      if (typeof value === "boolean") {
        const communityFolderPresent =
          await connectorSettingsHandler.current.getCommunityFolderPath();
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
    if (key === "adc_resolution" && typeof value === "string") {
      setConnectorSettings((prevState) => ({
        ...prevState,
        adc_resolution: parseInt(value),
      }));
    }
    if (key === "send_every_ms" && typeof value === "string") {
      setConnectorSettings((prevState) => ({
        ...prevState,
        send_every_ms: parseInt(value),
      }));
    }
  };

  const setCommunityFolderFromLaunchSetting = async (
    folderPath: string | undefined,
  ) => {
    setCommunityFolderVisible(false);
    if (!folderPath) {
      return;
    }
    await connectorSettingsHandler.current.setCommunityFolderPath(folderPath);
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
        <HeaderDivider text="Connector settings" />
        <Input
          label="Launch when sim starts"
          onLight={true}
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
        <HeaderDivider text="Microcontroller settings" />
        <Input
          label="Use terminal ready signal"
          onLight={true}
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
          label="Send message every ms"
          type="number"
          mt={2}
          onLight={true}
          infoLeft={true}
          onChange={(val) => onSettingsChange("send_every_ms", val)}
          value={connectorSettings.send_every_ms.toString()}
          infoWindow={
            <InfoWindow
              docs_url="https://bitsanddroids.github.io/FlightConnector-Rust/ch05-00-settings.html#adc-resolution"
              message="The ADC resolution of the microcontroller. This value is used to calculate the voltage of the ADC input."
            />
          }
        />
        <Input
          label="ADC Resolution"
          onLight={true}
          type="number"
          mt={2}
          infoLeft={true}
          onChange={(val) => onSettingsChange("adc_resolution", val)}
          value={connectorSettings.adc_resolution.toString()}
          infoWindow={
            <InfoWindow
              docs_url="https://bitsanddroids.github.io/FlightConnector-Rust/ch05-00-settings.html#adc-resolution"
              message="The ADC resolution of the microcontroller. This value is used to calculate the voltage of the ADC input."
            />
          }
        />
      </div>
    </div>
  );
};

export default SettingsPage;
