import { Meta, StoryObj } from "@storybook/react";
import { Output } from "@/model/Output";
import React from "react";
import { OutputSelectRows } from "./OutputSelectRows";

const meta: Meta<typeof OutputSelectRows> = {
  component: OutputSelectRows,
  argTypes: {
    dialogOpen: {
      control: {
        type: "boolean",
      },
    },
  },
};

export default meta;
const mockOutputs = [
  {
    id: 1,
    simvar: "A:SIMCONNECT:GENERAL_ENG1_COMBUSTION",
    cb_text: "Engine 1 Combustion",
    category: "Engine",
    selected: false,
  },
  {
    id: 2,
    simvar: "A:SIMCONNECT:GENERAL_ENG2_COMBUSTION",
    cb_text: "Engine 2 Combustion",
    category: "Engine",
    selected: false,
  },
  {
    id: 3,
    simvar: "A:SIMCONNECT:GENERAL_ENG3_COMBUSTION",
    cb_text: "Engine 3 Combustion",
    category: "Engine",
    selected: false,
  },
  {
    id: 4,
    simvar: "A:SIMCONNECT:GENERAL_ENG4_COMBUSTION",
    cb_text: "Engine 4 Combustion",
    category: "Engine",
    selected: false,
  },
  {
    id: 5,
    simvar: "A:SIMCONNECT:GENERAL_ENG1_COMBUSTION",
    cb_text: "Engine 1 Combustion",
    category: "Engine",
    selected: false,
  },
  {
    id: 6,
    simvar: "A:SIMCONNECT:GENERAL_ENG2_COMBUSTION",
    cb_text: "Engine 2 Combustion",
    category: "Engine",
    selected: false,
  },
  {
    id: 7,
    simvar: "A:SIMCONNECT:GENERAL_ENG3_COMBUSTION",
    cb_text: "Engine 3 Combustion",
    category: "Engine",
    selected: false,
  },
  {
    id: 8,
    simvar: "A:SIMCONNECT:GENERAL_ENG4_COMBUSTION",
    cb_text: "Engine 4 Combustion",
    category: "Engine",
    selected: false,
  },
];

const OutputSelectRowsWithHooks = () => {
  const [outputs, setOutputs] = React.useState(mockOutputs);
  const toggleOutput = (output: any) => {
    output.selected = !output.selected;
    setOutputs([...outputs]);
  };
  return (
    <OutputSelectRows
      outputs={outputs as Output[]}
      dialogOpen={false}
      toggleOutput={toggleOutput}
    />
  );
};
export const OutputSelectRowsStory: StoryObj = {
  render: OutputSelectRowsWithHooks,
  decorators: [
    (Story) => (
      <div className="w-screen h-screen bg-bitsanddroids-blue -m-4">
        <div className="p-4">
          <Story />
        </div>
      </div>
    ),
  ],
};
