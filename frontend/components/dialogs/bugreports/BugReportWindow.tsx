import { useState } from "react";
import { Button } from "../../elements/Button";
import { BugReport } from "@/model/BugReport";
import { fetch } from "@tauri-apps/plugin-http";
import { message } from "@tauri-apps/plugin-dialog";
import { Input } from "@/components/elements/inputs/Input";
import {
  getBundleData,
  getEventData,
  getPresetData,
  getSettingsData,
} from "./utils/BugReportParser";
interface BugReportWindowProps {
  closeWindow: () => void;
}

export const BugReportWindow = (props: BugReportWindowProps) => {
  const [issueMessage, setIssueMessage] = useState<string>("");
  const [issueNumber, setIssueNumber] = useState<string>("");
  const [discordUsername, setDiscordUsername] = useState<string>("");

  const submitBugReport = async () => {
    // send bug report to server
    const bugReport: BugReport = {
      discord_name: discordUsername,
      github_issue_nr: issueNumber,
      message: issueMessage,
      events: await getEventData(),
      bundle_settings: await getBundleData(),
      presets: await getPresetData(),
      run_settings: await getSettingsData(),
      // TODO: add logs
      logs: "test",
    };

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
    if (!result.ok) {
      await message("Failed to submit bug report", {
        title: "Error",
        kind: "error",
      });
      props.closeWindow();
      return;
    }
    await message("Bug report submitted successfully");
    props.closeWindow();
  };

  const onChangeMessage = (value: string) => {
    setIssueMessage(value);
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
          By submitting a report you&lsquo;ll automatically sumbmit the
          application data for further analysis.
        </p>

        <div className="flex flex-row mt-2">
          <Button
            text="Submit"
            style="primary"
            onClick={submitBugReport}
            data-testid="btn_submit_report"
          />
          <Button text="Cancel" style="danger" onClick={props.closeWindow} />
        </div>
      </div>
    </div>
  );
};
