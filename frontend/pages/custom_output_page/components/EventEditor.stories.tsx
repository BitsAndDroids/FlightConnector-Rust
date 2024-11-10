import { Meta, StoryObj } from "@storybook/react";
import { EventEditor } from "./EventEditor";
import { MockWasmEvent } from "#mocks/MockWasmEvent.js";

const meta: Meta<typeof EventEditor> = {
  component: EventEditor,
};

export default meta;

export const Primary: StoryObj = {
  args: {
    events: [MockWasmEvent],
  },
  decorators: [
    (Story) => (
      <div className="h-screen overflow-y-hidden bg-bitsanddroids-blue -m-4">
        <div className="flex flew-row align-middle items-center p-4">
          <Story />
        </div>
      </div>
    ),
  ],
};
