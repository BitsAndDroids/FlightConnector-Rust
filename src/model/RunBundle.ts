import { Bundle } from "./Bundle";

export interface RunBundle {
  id: number;
  com_port: string;
  connected: boolean;
  bundle: Bundle;
}
