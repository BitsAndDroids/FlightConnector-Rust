import { RunBundle } from "./RunBundle";

export interface Preset {
  id: string;
  name: string;
  version: string;
  runBundles: RunBundle[];
}
