import { Output } from "@/model/Output";
interface CategoryCheckboxesProps {
  outputs: Output[];
  dialogOpen: boolean;
  toggleOutput: (output: Output) => void;
}

export const OutputSelectRow = ({
  outputs,
  dialogOpen,
  toggleOutput,
}: CategoryCheckboxesProps) => {
  return (
    <div className="flex flex-col h-full w-full relative overflow-y-scroll">
      {outputs.map((output) => {
        return (
          <div key={output.cb_text} className="flex flex-row items-center">
            <input
              type="checkbox"
              className="text-green-600 focus:ring-green-500 rounded-md mr-2 h-6 w-6 -mt-1 accent-green-600"
              onChange={() => {
                toggleOutput(output);
              }}
              tabIndex={dialogOpen ? -1 : 1}
              checked={output.selected}
            />
            <div className="p-2 bg-white rounded-md mb-2 flex flex-row items-center">
              <div className="flex flex-col">
                <p className="rounded-md">{output.cb_text}</p>
                <p className="text-xs text-gray-500">{output.category}</p>
              </div>
              <div className="ml-2">
                <p>Update Every: </p>
                <p>{output.update_every}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
