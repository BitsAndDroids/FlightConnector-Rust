import { RunBundle } from "./RunBundle";

export interface Preset {
  id: number;
  name: string;
  version: string;
  runBundles: RunBundle[];
}
