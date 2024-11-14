import { Output } from "./Output";

export interface Bundle {
  name: string;
  version: number;
  outputs?: Output[];
  device?: boolean;
}
