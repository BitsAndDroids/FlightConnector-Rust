import { Output } from "@/model/Output";
interface CategoryCheckboxesProps {
  outputs: Output[];
  dialogOpen: boolean;
  toggleOutput: (output: Output) => void;
}

const CategoryCheckboxes = ({
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
            <label className="bg-white p-2 rounded-md mb-2">
              {output.simvar.toLowerCase()}
            </label>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryCheckboxes;
