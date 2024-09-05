import { Meta, StoryObj } from "@storybook/react";
import { OutputSelectRow } from "./OutputSelectRow";
import React from "react";

const meta: Meta<typeof OutputSelectRow> = {
  component: OutputSelectRow,
};
export default meta;

const OutputSelectRowWithHooks = () => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [output, setOutputs] = React.useState({
    id: 1,
    simvar: "A:SIMCONNECT:GENERAL_ENG1_COMBUSTION",
    cb_text: "Engine 1 Combustion",
    category: "Engine",
    selected: false,
    output_type: "number",
    metric: "gallons",
    update_every: 1,
  });
  const [toggleOutput, setToggleOutput] = React.useState(true);

  const changeToggleOutput = (output: any) => {
    setToggleOutput(output);
    setOutputs({ ...output, selected: !output.selected });
  };
  return (
    <OutputSelectRow
      index={0}
      output={output}
      dialogOpen={dialogOpen}
      toggleOutput={changeToggleOutput}
    />
  );
};

export const OutputSelectRowStory: StoryObj = {
  render: OutputSelectRowWithHooks,
  // args: {
  //   output: {
  //     id: 1,
  //     simvar: "A:SIMCONNECT:GENERAL_ENG1_COMBUSTION",
  //     cb_text: "Engine 1 Combustion",
  //     category: "Engine",
  //     selected: false,
  //   },
  //   dialogOpen: false,
  //   toggleOutput: (output: any) => {
  //     console.log(output);
  //   },
  // },
};
