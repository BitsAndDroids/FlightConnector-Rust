import { Meta, StoryObj } from "@storybook/react";
import { WasmEventRow } from "./WasmEventRow";

const meta: Meta<typeof WasmEventRow> = {
  component: WasmEventRow,
};

export default meta;

const wasmEvent = {
  id: 1002,
  action: "0 (>A:TRANSPONDER STATE:1, enum)",
  action_text: "Tranpsponder state off",
  action_type: "input",
  output_format: "",
  update_every: 0.0,
  min: 0.0,
  max: 100.0,
  plane_or_category: ["generic", "a320"],
};
export const WasmEventRowStory: StoryObj = {
  args: {
    wasmEvent,
    index: 0,
  },
  decorators: [
    (Story: any) => (
      <div className="w-screen bg-bitsanddroids-blue h-screen min-h-full -m-4 p-4">
        <Story />
      </div>
    ),
  ],
};
