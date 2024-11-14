import { WASMEvent } from "#model/WASMEvent.js";
import { Bundle } from "../../model/Bundle";

export interface PartnerDevice {
  name: string;
  id: string;
  madeBy: string;
  bundle: Bundle;
  //If the device requires WASM events to function
  requiresWASM: boolean;
  //If the device requires custom events to be sent to the WASM in order to function
  //they can be defined here, they will be added to the users events if not pressent
  customEvents?: Array<WASMEvent>;
  version: string;
  imageUrl?: string;
  gitHubUrl?: string;
  productUrl?: string;
}
