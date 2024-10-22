import { Meta, StoryObj } from "@storybook/react";
import { PresetManagerPage } from "./PresetManagerPage";

const meta: Meta<typeof PresetManagerPage> = {
  component: PresetManagerPage,
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
