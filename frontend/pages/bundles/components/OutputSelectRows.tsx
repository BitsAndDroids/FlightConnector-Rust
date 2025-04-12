import { Output } from "@/model/Output";
import { OutputSelectRow } from "./OutputSelectRow";
interface CategoryCheckboxesProps {
  outputs: Output[];
  dialogOpen: boolean;
  toggleOutput: (output: Output) => void;
  changeUpdateRate: (output: Output) => void;
}

export const OutputSelectRows = ({
  outputs,
  dialogOpen,
  toggleOutput,
  changeUpdateRate,
}: CategoryCheckboxesProps) => {
  return (
    <div className="flex flex-col h-full w-full overflow-y-scroll pl-2">
      {outputs.map((output, index) => (
        <OutputSelectRow
          key={output.id}
          output={output}
          index={index}
          dialogOpen={dialogOpen}
          toggleOutput={toggleOutput}
          changeUpdateRate={changeUpdateRate}
        />
      ))}
    </div>
  );
};
