import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
  component: Input,
  argTypes: {
    label: {
      control: {
        type: "text",
      },
    },
    type: {
      control: {
        type: "select",
      },
      options: ["text", "number"],
    },
  },
};

export default meta;

export const InputType: StoryObj = {
  args: {
    label: "Input",
    value: "Input Value",
    type: "text",
    onLight: true,
    onChange: () => {},
  },
  decorators: [
    (Story, { args }: any) => (
      <div
        className={`${args.onLight ? "bg-white" : "bg-bitsanddroids-blue"} -m-4 h-screen w-screen`}
      >
        <div className="p-4">
          <Story />
        </div>
      </div>
    ),
  ],
};

export const TextAreaType: StoryObj = {
  args: {
    label: "Input",
    value: "This is a text area",
    type: "textarea",
    onLight: true,
    onChange: () => {},
  },

  decorators: [
    (Story, { args }: any) => (
      <div
        className={`${args.onLight ? "bg-white" : "bg-bitsanddroids-blue"} -m-4 h-screen w-screen`}
      >
        <div className="m-4">
          <Story />
        </div>
      </div>
    ),
  ],
};

export const NumberType: StoryObj = {
  args: {
    label: "Input",
    value: 124850,
    type: "number",
    onLight: true,
    onChange: () => {},
  },

  decorators: [
    (Story, { args }: any) => (
      <div
        className={`${args.onLight ? "bg-white" : "bg-bitsanddroids-blue"} -m-4 h-screen w-screen`}
      >
        <div className="p-4">
          <Story />
        </div>
      </div>
    ),
  ],
};

export const CheckboxType: StoryObj = {
  args: {
    label: "Checkbox",
    value: true,
    type: "checkbox",
    onLight: true,
    onChange: () => {},
  },

  decorators: [
    (Story, { args }: any) => (
      <div
        className={`${args.onLight ? "bg-white" : "bg-bitsanddroids-blue"} -m-4 h-screen w-screen`}
      >
        <div className="p-4">
          <Story />
        </div>
      </div>
    ),
  ],
};
