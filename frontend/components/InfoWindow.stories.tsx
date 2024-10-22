import { Meta, StoryObj } from "@storybook/react";
import InfoWindow from "./InfoWindow";

const meta: Meta<typeof InfoWindow> = {
  component: InfoWindow,
};

export default meta;

export const InfoWindowStory: StoryObj = {
  args: {
    message: "Info Window",
    docs_url: "https://google.com",
  },
  decorators: [
    (Story) => (
      <div className="m-20 w-fit">
        {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
        <Story />
      </div>
    ),
  ],
};
