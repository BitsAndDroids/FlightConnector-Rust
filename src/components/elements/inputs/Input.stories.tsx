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
};

export const TextAreaType: StoryObj = {
  args: {
    label: "Input",
    value: "This is a text area",
    type: "textarea",
    onLight: true,
    onChange: () => {},
  },
};

export const NumberType: StoryObj = {
  args: {
    label: "Input",
    value: 124850,
    type: "number",
    onLight: true,
    onChange: () => {},
  },
};

export const CheckboxType: StoryObj = {
  args: {
    label: "Checkbox",
    value: true,
    type: "checkbox",
    onLight: true,
    onChange: () => {},
  },
};
