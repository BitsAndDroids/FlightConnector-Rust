import { WASMEvent } from "@/model/WASMEvent";

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
};

export const getMockWasmEvents = (count: number): WASMEvent[] => {
  const events: WASMEvent[] = [];
  for (let i = 0; i < count; i++) {
    events.push({ ...MockWasmEvent, id: i });
  }
  return events;
};
