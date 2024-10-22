import { WASMEvent } from "@/model/WASMEvent";
import { MockWASMEventArray } from "./WasmEventArray";

export const MockWasmEvent: WASMEvent = {
  id: 0,
  action: "this is a mock action",
  action_text: "this is mock text",
  action_type: "output",
  output_format: "time",
  update_every: 0,
  min: 0,
  max: 0,
  value: 0,
  offset: 0,
  plane_or_category: ["category", "plane type"],
  made_by: "BitsAndDroids",
};

export const getMockWasmEvents = (count: number): WASMEvent[] => {
  let events: WASMEvent[] = [];
  for (let i = 0; i < count; i++) {
    let randomIndex = Math.floor(Math.random() * MockWASMEventArray.length);
    events.push(MockWASMEventArray[randomIndex]);
  }
  return events;
};

export const getAllMockWasmEvents = (): WASMEvent[] => {
  return MockWASMEventArray;
};
