import { FlightCompanionBundle } from "#partner_devices/bundles/FlightCompanionBundle";
import { PartnerDevice } from "#partner_devices/models/PartnerDevice.js";

export const FlightCompanion: PartnerDevice = {
  name: "Flight companion",
  madeBy: "BitsAndDroids",
  bundle: FlightCompanionBundle,
  version: "1.0.0",
  id: "fc332118-1786-4684-9640-ccfbf8f4cc30",
  imageUrl:
    "https://shop.bitsanddroids.com/cdn/shop/files/shop_overview-4.jpg?v=1718548830&width=713",
  requiresWASM: true,
  gitHubUrl: "https://github.com/BitsAndDroids/FlightCompanion",
  productUrl:
    "https://shop.bitsanddroids.com/products/custom-primary-flight-display-for-microsoft-flight-simulator-2020",
};
