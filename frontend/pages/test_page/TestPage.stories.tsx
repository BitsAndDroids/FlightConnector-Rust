import { Meta, StoryObj } from "@storybook/react";
import { TestPage } from "./TestPage";

const meta: Meta = {
  title: "TestPage",
  component: TestPage,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

export const Default: StoryObj = {
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
