import { PartnerDevice } from "#pages/connection_page/models/PartnerDevice.js";
import { FlightCompanionBundle } from "#partner_devices/bundles/FlightCompanionBundle.js";

export const FlightCompanion: PartnerDevice = {
  name: "Flight companion",
  madeBy: "BitsAndDroids",
  bundle: FlightCompanionBundle,
  version: "1.0.0",
};
