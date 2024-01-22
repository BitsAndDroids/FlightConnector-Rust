import { Output } from "./Output";

export interface Bundle {
  name: string;
  version: string;
  outputs: Output[];
}
