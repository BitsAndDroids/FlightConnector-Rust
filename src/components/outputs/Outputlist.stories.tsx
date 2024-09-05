import { Meta, StoryObj } from "@storybook/react";
import Outputlist from "./Outputlist";

const meta: Meta<typeof Outputlist> = {
  component: Outputlist,
};

export default meta;

export const OutputlistStory: StoryObj = {
  args: {
    bundle: {
      name: "Test Bundle",
      outputs: [
        {
          id: 1,
          simvar: "A:SimVar",
        },
        {
          id: 2,
          simvar: "A:SimVar2",
        },
      ],
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-bitsanddroids-blue p-4 h-screen w-screen -m-4">
        <div className="w-1/2">
          <Story />
        </div>
      </div>
    ),
  ],
};
