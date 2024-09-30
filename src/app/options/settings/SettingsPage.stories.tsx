import { Meta, StoryObj } from "@storybook/react";
import SettingsPage from "./SettingsPage";

const meta: Meta<typeof SettingsPage> = {
  component: SettingsPage,
};

export default meta;

export const Primary: StoryObj = {
  args: {},
  decorators: [
    (Story) => (
      <div className="w-full h-full bg-bitsanddroids-blue -m-4">
        <Story />
      </div>
    ),
  ],
};
