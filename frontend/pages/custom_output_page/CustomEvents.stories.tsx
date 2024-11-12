import { Meta, StoryObj } from "@storybook/react";
import { getMockWasmEvents } from "@/mocks/MockWasmEvent";
import { CustomEvents } from "./CustomEvents";

const meta: Meta<typeof CustomEvents> = {
  component: CustomEvents,
};

export default meta;

export const Primary: StoryObj = {
  args: {
    events: getMockWasmEvents(10),
  },
  decorators: [
    (Story) => {
      return (
        <div className="bg-bitsanddroids-blue -m-4">
          <div className="p-4">
            <Story />
          </div>
        </div>
      );
    },
  ],
};
