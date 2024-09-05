import { Meta, StoryObj } from "@storybook/react";
import { BugReportWindow } from "./BugReportWindow";

const meta: Meta<typeof BugReportWindow> = {
  component: BugReportWindow,
};

export default meta;

export const BugReportWindowStory: StoryObj = {
  decorators: [
    (Story) => (
      <div className=" bg-bitsanddroids-blue w-screen h-screen -m-4 p-0">
        <Story />
      </div>
    ),
  ],
};
