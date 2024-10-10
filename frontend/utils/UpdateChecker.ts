import { ConnectorSettingsHandler } from "./connectorSettingsHandler";

export const hasReadLatestPatchNotes = async () => {
  const connectorSettingsHandler = new ConnectorSettingsHandler();
  const latestPatchNotesRead =
    await connectorSettingsHandler.getLatestPatchNotesRead();
  const latestPatchNotesReq = await fetch(
    "https://www.bitsanddroids.com/api/release/latest",
  );
  const latestPatchNotes = await latestPatchNotesReq.json();
  if (
    latestPatchNotesRead === null ||
    latestPatchNotes.tag !== latestPatchNotesRead
  ) {
    return { read: false, tag: latestPatchNotes };
  }
  return { read: true, tag: latestPatchNotes };
};
