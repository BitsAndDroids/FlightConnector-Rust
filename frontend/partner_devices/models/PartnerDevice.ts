import { Bundle } from "../../model/Bundle";

export interface PartnerDevice {
  name: string;
  imageUrl?: string;
  madeBy: string;
  bundle: Bundle;
  version: string;
  gitHubUrl?: string;
  productUrl?: string;
}
