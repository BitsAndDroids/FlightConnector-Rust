import { Meta, StoryObj } from "@storybook/react";
import { WasmEventFilter } from "./WasmEventFilter";

const meta: Meta<typeof WasmEventFilter> = {
  component: WasmEventFilter,
};

export default meta;

export const WasmEventFilterStory: StoryObj = {
  args: {
    filter: {
      query: "",
      type: "All",
      category: "All",
      madeBy: "All",
    },
  },
  decorators: [
    (Story: any) => (
      <div className="w-screen bg-bitsanddroids-blue h-screen min-h-full -m-4 p-4">
        <Story />
      </div>
    ),
  ],
};
