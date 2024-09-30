import { Meta, StoryObj } from "@storybook/react";
import { CustomEvents } from "./CustomEvents";

const meta: Meta<typeof CustomEvents> = {
  component: CustomEvents,
};

export default meta;

export const Primary: StoryObj = {
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
