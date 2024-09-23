import { Meta, StoryObj } from "@storybook/react";
import { ControllerSelect } from "./ControllerSelect";

const meta: Meta<typeof ControllerSelect> = {
  component: ControllerSelect,
};

export default meta;

export const Primary: StoryObj = {
  args: {
    comPorts: ["COM1", "COM2"],
    selectedComPort: "COM1",
    bundles: [{ name: "Bundle 1" }, { name: "Bundle 2" }],
    setComPort: (comPort: string, runBundle: any) =>
      console.log(comPort, runBundle),
    setBundle: (bundle: string, runBundle: any) =>
      console.log(bundle, runBundle),
    removeRow: (id: number) => console.log(id),
  },
  decorators: [
    (Story) => (
      <div className="bg-bitsanddroids-blue w-screen h-screen -m-4">
        <div className="p-8">
          <Story />
        </div>
      </div>
    ),
  ],
};
