import { Meta, StoryObj } from "@storybook/react";
import { RunComponent } from "./RunComponent";

const meta: Meta<typeof RunComponent> = {
  component: RunComponent,
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
