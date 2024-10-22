import { Meta, StoryObj } from "@storybook/react";
import { PresetManager } from "./PresetManager";

const meta: Meta<typeof PresetManager> = {
  component: PresetManager,
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
