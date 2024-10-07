import { Meta, StoryObj } from "@storybook/react";
import { WasmEventManager } from "./WasmEventManager";
import { getAllMockWasmEvents, getMockWasmEvents } from "@/mocks/MockWasmEvent";

const meta: Meta<typeof WasmEventManager> = {
  component: WasmEventManager,
};

export default meta;

export const Primary: StoryObj = {
  args: {
    events: getAllMockWasmEvents(),
  },
  decorators: [
    (Story) => {
      return (
        <div className="w-screen h-screen overflow-y-hidden bg-bitsanddroids-blue -m-4">
          <div className="p-4 w-full">
            <Story />
          </div>
        </div>
      );
    },
  ],
};
