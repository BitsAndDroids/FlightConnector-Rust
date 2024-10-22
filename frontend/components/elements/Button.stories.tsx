import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  component: Button,
  argTypes: {
    style: {
      control: {
        type: "select",
        options: ["primary", "secondary", "danger"],
      },
    },
  },
};

export default meta;

export const Primary: StoryObj = {
  args: {
    style: "primary",
    text: "Primary",
    onClick: () => {
      alert("Primary");
    },
  },
};
