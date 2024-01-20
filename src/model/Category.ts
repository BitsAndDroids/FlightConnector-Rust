import { Output } from "./Output";

export interface Category {
  name: string,
  //outputs: Vec<Output>,
  outputs: Output[],
  collapsed?: boolean,
}
