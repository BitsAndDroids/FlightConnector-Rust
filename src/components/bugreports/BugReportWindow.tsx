import { useState } from "react";
import { Button } from "../elements/Button";
import { Input } from "../elements/Input";
import { CustomEventHandler } from "@/utils/CustomEventHandler";
import { BundleSettingsHandler } from "@/utils/BundleSettingsHandler";
import { PresetSettingsHandler } from "@/utils/PresetSettingsHandler";
import { ConnectorSettingsHandler } from "@/utils/connectorSettingsHandler";
import { RunSettingsHandler } from "@/utils/runSettingsHandler";
import { BugReport } from "@/model/BugReport";
import { fetch } from "@tauri-apps/plugin-http";
interface BugReportWindowProps {
  closeWindow: () => void;
}

export const BugReportWindow = (props: BugReportWindowProps) => {
  const [message, setMessage] = useState<string>("");
  const [issueNumber, setIssueNumber] = useState<string>("");
  const [discordUsername, setDiscordUsername] = useState<string>("");

  const getEventData = async () => {
    const eventHandler = new CustomEventHandler();
    const eventData = await eventHandler.getAllEvents();
    // filter all events < id 3000
    eventData.filter((event) => event.id < 3000);
    return JSON.stringify(eventData);
  };

  const getBundleData = async () => {
    const bundleHandler = new BundleSettingsHandler();
    const bundles = await bundleHandler.getSavedBundles();
    return JSON.stringify(bundles);
  };

  const getPresetData = async () => {
    const presetHandler = new PresetSettingsHandler();
    const presets = await presetHandler.getAllPresets();
    return JSON.stringify(presets);
  };

  const getSettingsData = async () => {
    const connectorSettingsHandler = new ConnectorSettingsHandler();
    const connectors = await connectorSettingsHandler.getAllConnectorSettings();

    const runSettingsHandler = new RunSettingsHandler();
    const runSettings = await runSettingsHandler.getAllRunSettings();
    return JSON.stringify({ connector: connectors, run: runSettings });
  };

  const submitBugReport = async () => {
    // send bug report to server
    const bugReport: BugReport = {
      discord_name: discordUsername,
      github_issue_nr: issueNumber,
      message: message,
      events: await getEventData(),
      bundle_settings: await getBundleData(),
      presets: await getPresetData(),
      run_settings: await getSettingsData(),
      // TODO: add logs
      logs: "test",
    };

    console.log(bugReport);

    const result = await fetch(
      "https://www.bitsanddroids.com/api/bug_reports",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bugReport),
      },
    );
    console.log(result);
    props.closeWindow();
  };

  const onChangeMessage = (value: string) => {
    setMessage(value);
  };

  const onChangeIssueNumber = (value: string) => {
    setIssueNumber(value);
  };

  const onChangeDiscordUsername = (value: string) => {
    setDiscordUsername(value);
  };

  return (
    <div className="w-[100%] h-[100%] min-h-[100%] min-w-[100%] -translate-y-1/2 -translate-x-1/2 fixed top-1/2 left-1/2 bg-opacity-50 z-50 flex flew-row align-middle justify-center items-center backdrop-blur-sm drop-shadow-lg">
      <div className="bg-white w-1/2 p-4 rounded-md">
        <Input
          type="textarea"
          placeholder="Enter your bug report here"
          label="Describe the issue"
          required={true}
          onChange={(value) => onChangeMessage(value as string)}
        />
        <Input
          type="text"
          placeholder="Enter an Github issue number if applicable"
          label="Github issue number (optional)"
          onChange={(value) => onChangeIssueNumber(value as string)}
        />
        <Input
          type="text"
          placeholder="Enter your discord username if you want to be contacted for more information"
          label="Discord username (optional)"
          onChange={(value) => onChangeDiscordUsername(value as string)}
        />
        <p className="text-sm text-gray-500">
          By submitting a report you'll automatically sumbmit the application
          data for further analysis.
        </p>

        <div className="flex flex-row mt-2">
          <Button text="Submit" style="primary" onClick={submitBugReport} />
          <Button text="Cancel" style="danger" onClick={props.closeWindow} />
        </div>
      </div>
    </div>
  );
};
