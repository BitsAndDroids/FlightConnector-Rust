import { Meta, StoryObj } from "@storybook/react";
import { FileDialog } from "./FileDialog";

const meta: Meta<typeof FileDialog> = {
  component: FileDialog,
};

export default meta;

export const FileDialogStory: StoryObj = {
  args: {
    message: "File Dialog",
    value: "File Dialog Value",
    placeholder: "File Dialog Placeholder",
    InfoWindow: "File Dialog InfoWindow",
  },
};
