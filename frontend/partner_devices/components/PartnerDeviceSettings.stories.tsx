import { Meta, StoryObj } from "@storybook/react";
import { PartnerDeviceSettings } from "./PartnerDeviceSettings";

const meta: Meta<typeof PartnerDeviceSettings> = {
  component: PartnerDeviceSettings,
};

export default meta;

export const Primary: StoryObj = {
  args: {
    onConfirm: () => {},
    setDialogOpen: () => {},
  },

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
