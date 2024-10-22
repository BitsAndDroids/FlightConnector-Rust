import { BundleSettingsHandler } from "@/utils/BundleSettingsHandler";
import { ConnectorSettingsHandler } from "@/utils/connectorSettingsHandler";
import { CustomEventHandler } from "@/utils/CustomEventHandler";
import { PresetSettingsHandler } from "@/utils/PresetSettingsHandler";
import { RunSettingsHandler } from "@/utils/runSettingsHandler";
//TODO: Create class instead of functions
export const getEventData = async () => {
  const eventHandler = new CustomEventHandler();
  let eventData = await eventHandler.getAllEvents();
  // filter all events > id 3000 (non-default events)
  eventData = eventData.filter((event) => event.id > 3000);
  return JSON.stringify(eventData);
};

export const getSettingsData = async () => {
  const connectorSettingsHandler = new ConnectorSettingsHandler();
  const connectors = await connectorSettingsHandler.getAllConnectorSettings();

  const runSettingsHandler = new RunSettingsHandler();
  const runSettings = await runSettingsHandler.getAllRunSettings();
  return JSON.stringify({ connector: connectors, run: runSettings });
};

export const getBundleData = async () => {
  const bundleHandler = new BundleSettingsHandler();
  const bundles = await bundleHandler.getSavedBundles();
  return JSON.stringify(bundles);
};

export const getPresetData = async () => {
  const presetHandler = new PresetSettingsHandler();
  const presets = await presetHandler.getAllPresets();
  return JSON.stringify(presets);
};
