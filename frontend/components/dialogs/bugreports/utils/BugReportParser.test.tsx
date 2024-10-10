import { CustomEventHandler } from "@/utils/CustomEventHandler";
import { beforeEach, describe, expect, test, vi } from "vitest";
import {
  getBundleData,
  getEventData,
  getPresetData,
  getSettingsData,
} from "./BugReportParser";
import { ConnectorSettingsHandler } from "@/utils/connectorSettingsHandler";
import { RunSettingsHandler } from "@/utils/runSettingsHandler";
import { PresetSettingsHandler } from "@/utils/PresetSettingsHandler";
import { BundleSettingsHandler } from "@/utils/BundleSettingsHandler";

describe("BugReportParser", async () => {
  let customEventHandler: any;
  let connectorSettingsHandler: any;
  let runSettingsHandler: any;
  let presetSettingsHandler: any;
  let bundleSettingsHandler: any;
  vi.mock("@/utils/CustomEventHandler", () => {
    const CustomEventHandler = vi.fn();
    CustomEventHandler.prototype.getAllEvents = vi.fn();
    return { CustomEventHandler };
  });
  vi.mock("@/utils/connectorSettingsHandler", () => {
    const ConnectorSettingsHandler = vi.fn();
    ConnectorSettingsHandler.prototype.getAllConnectorSettings = vi.fn();
    return { ConnectorSettingsHandler };
  });
  vi.mock("@/utils/runSettingsHandler", () => {
    const RunSettingsHandler = vi.fn();
    RunSettingsHandler.prototype.getAllRunSettings = vi.fn();
    return { RunSettingsHandler };
  });
  vi.mock("@/utils/PresetSettingsHandler", () => {
    const PresetSettingsHandler = vi.fn();
    PresetSettingsHandler.prototype.getAllPresets = vi.fn();
    return { PresetSettingsHandler };
  });
  vi.mock("@/utils/BundleSettingsHandler", () => {
    const BundleSettingsHandler = vi.fn();
    BundleSettingsHandler.prototype.getSavedBundles = vi.fn();
    return { BundleSettingsHandler };
  });

  beforeEach(() => {
    customEventHandler = new CustomEventHandler();
    connectorSettingsHandler = new ConnectorSettingsHandler();
    runSettingsHandler = new RunSettingsHandler();
    presetSettingsHandler = new PresetSettingsHandler();
    bundleSettingsHandler = new BundleSettingsHandler();
  });
  test("Should filter events with id > 3000", async () => {
    const mockEvents = [{ id: 2000 }, { id: 4000 }, { id: 5000 }];
    customEventHandler.getAllEvents.mockResolvedValue(mockEvents);
    const result = await getEventData();
    expect(customEventHandler.getAllEvents).toHaveBeenCalled();
    expect(result).toEqual(JSON.stringify(mockEvents.slice(1)));
  });
  test("Should format settings data", async () => {
    const mockConnectors = [{ id: 1 }, { id: 2 }];
    const mockRunSettings = [{ id: 1 }, { id: 2 }];
    connectorSettingsHandler.getAllConnectorSettings.mockResolvedValue(
      mockConnectors,
    );
    runSettingsHandler.getAllRunSettings.mockResolvedValue(mockRunSettings);
    const result = await getSettingsData();
    expect(connectorSettingsHandler.getAllConnectorSettings).toHaveBeenCalled();
    expect(runSettingsHandler.getAllRunSettings).toHaveBeenCalled();
    expect(result).toEqual(
      JSON.stringify({
        connector: mockConnectors,
        run: mockRunSettings,
      }),
    );
  });
  test("Should format bundle data", async () => {
    const mockBundles = [{ id: 1 }, { id: 2 }];
    bundleSettingsHandler.getSavedBundles.mockResolvedValue(mockBundles);
    const result = await getBundleData();
    expect(bundleSettingsHandler.getSavedBundles).toHaveBeenCalled();
    expect(result).toEqual(JSON.stringify(mockBundles));
  });
  test("Should format preset data", async () => {
    const mockPresets = [{ id: 1 }, { id: 2 }];
    presetSettingsHandler.getAllPresets.mockResolvedValue(mockPresets);
    const result = await getPresetData();
    expect(presetSettingsHandler.getAllPresets).toHaveBeenCalled();
    expect(result).toEqual(JSON.stringify(mockPresets));
  });
});
