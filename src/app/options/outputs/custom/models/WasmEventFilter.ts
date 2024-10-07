export interface WasmEventFilterParams {
  query: string;
  type: "Input" | "Output" | "All";
  category: string;
  madeBy: string;
}
