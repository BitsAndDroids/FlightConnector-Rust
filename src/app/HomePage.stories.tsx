import { Meta, StoryObj } from "@storybook/react";
import HomePage from "./HomePage";

const meta: Meta<typeof HomePage> = {
  component: HomePage,
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
