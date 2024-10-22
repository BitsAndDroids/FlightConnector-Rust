import { Meta, StoryObj } from "@storybook/react";
import PresetControls from "./PresetControls";

const meta: Meta<typeof PresetControls> = {
  component: PresetControls,
};

export default meta;

export const Primary: StoryObj = {
  decorators: [
    (Story) => (
      <div className="w-screen h-screen bg-bitsanddroids-blue -m-4">
        <div className="p-4">
          <Story />
        </div>
      </div>
    ),
  ],
};
