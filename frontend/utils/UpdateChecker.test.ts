import { ConnectorSettingsHandler } from "./connectorSettingsHandler";
import { hasReadLatestPatchNotes } from "./UpdateChecker";
import { assert, test } from "vitest";

// Mock ConnectorSettingsHandler
ConnectorSettingsHandler.prototype.getLatestPatchNotesRead = async () =>
  "1.0.0";

// Mock fetch
global.fetch = async () =>
  ({
    json: async () => ({ tag: "1.0.1" }),
  }) as any;

test("hasReadLatestPatchNotes", async () => {
  const result = await hasReadLatestPatchNotes();
  assert.strictEqual(result.read, false);
  assert.strictEqual(result.tag.tag, "1.0.1");
});
