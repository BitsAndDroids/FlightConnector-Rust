import { Meta, StoryObj } from "@storybook/react";
import { FileDialog } from "./FileDialog";
import InfoWindow from "./InfoWindow";

const meta: Meta<typeof FileDialog> = {
  component: FileDialog,
};

export default meta;

export const FileDialogStory: StoryObj = {
  args: {
    message: "File Dialog",
    value: "File Dialog Value",
    placeholder: "File Dialog Placeholder",
    InfoWindow: (
      <InfoWindow message="Info Window" docs_url="https://google.com" />
    ),
  },
};
