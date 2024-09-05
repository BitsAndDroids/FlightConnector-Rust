import { Meta, StoryObj } from "@storybook/react";
import { EventEditor } from "./EventEditor";

const meta: Meta<typeof EventEditor> = {
  component: EventEditor,
};

export default meta;

export interface WASMEvent {
  id: number;
  action: string;
  action_text: string;
  action_type: string;
  output_format: string;
  update_every: number;
  min: number;
  max: number;
  value: number;
  offset: number;
  plane_or_category: string;
}

export const EventEditorStory: StoryObj = {
  args: {
    event: {
      id: 0,
      action: "",
      action_type: "",
      output_format: "int",
      update_every: 1.0,
      min: 1.0,
      max: 1.0,
      value: 10,
      offset: 10,
      plane_or_category: "General aviation",
    },
    onSave: () => {},
    eventErrors: {} as any,
  },
  decorators: [
    (Story) => (
      <div className="bg-bitsanddroids-blue -m-4 w-screen h-screen">
        <Story />
      </div>
    ),
  ],
};
