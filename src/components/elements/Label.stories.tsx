import { Meta, StoryObj } from "@storybook/react";
import { Label } from "./Label";

const meta: Meta<typeof Label> = {
  component: Label,
};

export default meta;

export const LabelStory: StoryObj = {
  args: {
    text: "Label",
    onLight: true,
  },
  decorators: [
    (Story, { args }: any) => (
      <div
        className={`${args.onLight ? "bg-white" : "bg-bitsanddroids-blue"} -m-4 w-screen h-screen`}
      >
        <Story />
      </div>
    ),
  ],
};
