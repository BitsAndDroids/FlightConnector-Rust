import InfoWindow from "@/components/InfoWindow";
import { Input } from "@/components/elements/Input";
import { ConnectorSettingsHandler } from "@/utils/connectorSettingsHandler";
import { ConnectorSettings } from "@/utils/models/ConnectorSettings";
import { message } from "@tauri-apps/plugin-dialog";
import { useEffect, useState } from "react";
import { changeLaunchWhenSimStarts } from "./services/LaunchService";

const SettingsPage = () => {
  const [connectorSettings, setConnectorSettings] = useState<ConnectorSettings>(
    { use_trs: false, launch_when_sim_starts: false },
  );

  const connectorSettingsHandler = new ConnectorSettingsHandler();

  useEffect(() => {
    const initSettings = async () => {
      let savedSettings = await connectorSettingsHandler.getConnectorSettings();
      if (!savedSettings) {
        return;
      }
      setConnectorSettings(savedSettings);
    };
    initSettings();
  }, []);

  const onSettingsChange = (key: keyof ConnectorSettings, value: unknown) => {
    const newSettings = { ...connectorSettings };
    console.log(key, value);
    if (key === "use_trs") {
      if (typeof value === "boolean") newSettings.use_trs = value;
    }
    if (key === "launch_when_sim_starts") {
      if (typeof value === "boolean") {
        newSettings.launch_when_sim_starts = value;
        changeLaunchWhenSimStarts(value);
      }
    }
    console.log(newSettings);
    setConnectorSettings(newSettings);
  };

  const saveSettings = async () => {
    connectorSettingsHandler.setConnectorSettings(connectorSettings);
    await message("Settings saved", "success");
  };

  return (
    <div className="p-2 px-4 bg-bitsanddroids-blue h-screen w-screen">
      <div className="mt-10 flex flex-row align-center">
        <h1
          className={"text-2xl font-bold tracking-tight text-white sm:text-4xl"}
        >
          Settings
        </h1>
      </div>
      <div className="bg-white rounded-md mt-4 p-4">
        <label className="flex flex-row items-center">
          <Input
            infoWindow={
              <InfoWindow
                docs_url="https://bitsanddroids.github.io/FlightConnector-Rust/ch05-00-settings.html#enable-trs"
                message="The terminal ready signal can be used to force a reset when the connector initializes a connection with a microcontroller. Depending on your connected devices it might be nescesarry to order your devices to work with the resets."
              />
            }
            label="Use terminal ready signal"
            type="checkbox"
            onChange={(val) => onSettingsChange("use_trs", val)}
            value={connectorSettings.use_trs}
          />
        </label>
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
      <button
        type="button"
        className={
          "rounded-md bg-green-600 text-white text-sm font-semibold px-3.5 py-2.5 mt-4 flex flex-row items-center"
        }
        onClick={() => {
          saveSettings();
        }}
      >
        {" "}
        <img src="/save.svg" alt="save" className="w-4 h-4 mr-2" />
        Save settings{" "}
      </button>
    </div>
  );
};

export default SettingsPage;
