import { Output } from "@/model/Output";
import { WASMEvent } from "@/model/WASMEvent";

export interface ProjectEvents {
  inputs: Array<InputEvent>;
  outputs: Array<Output>;
  customEvents: Array<WASMEvent>;
}
