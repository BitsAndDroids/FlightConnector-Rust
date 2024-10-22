import { Meta, StoryObj } from "@storybook/react";
import { ControllerSelectComponent } from "./ControllerSelectComponent";

const meta: Meta<typeof ControllerSelectComponent> = {
  component: ControllerSelectComponent,
};

export default meta;

export const Primary: StoryObj = {
  decorators: [
    (Story) => (
      <div className="w-screen h-screen bg-bitsanddroids-blue -m-4">
        <div className="p-4 h-full flex flex-row align-middle w-full justify-items-center justify-center items-center">
          <Story />
        </div>
      </div>
    ),
  ],
};
