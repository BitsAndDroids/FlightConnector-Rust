import { Input } from "#components/elements/inputs/Input.js";
import { Output } from "@/model/Output";
interface CategoryCheckboxesProps {
  output: Output;
  index: number;
  dialogOpen: boolean;
  toggleOutput: (output: Output) => void;
  changeUpdateRate: (output: Output) => void;
}

export const OutputSelectRow = ({
  output,
  index,
  dialogOpen,
  toggleOutput,
  changeUpdateRate,
}: CategoryCheckboxesProps) => {
  return (
    <div key={output.id} className="flex flex-row items-center">
      <input
        type="checkbox"
        name="checked"
        className="text-green-600 focus:ring-green-500 rounded-md mr-2 h-6 w-6 -mt-1 accent-green-600"
        onChange={() => {
          toggleOutput(output);
        }}
        tabIndex={dialogOpen ? -1 : 1}
        checked={output.selected}
      />
      <div
        className={`p-2 w-full bg-gradient-to-r from-[rgba(255,255,255,0.9)]   ${output.selected ? "to-[rgba(200,255,200,0.7)]" : "to-[rgba(200,200,220,0.7)]"} rounded-md mb-2 flex flex-row items-center drop-shadow mr-2 align-middle shadow-[inset_0_-2px_4px_rgba(180,255,255,0.9)]`}
      >
        <div className="flex flex-col w-3/4">
          <span className="has-tooltip">
            <span
              className={`${index === 0 ? "tooltip-bot" : "tooltip"} rounded shadow-lg p-1 bg-gray-100`}
            >
              {output.simvar}
            </span>
            <p className="rounded-md  font-bold text-lg">{output.cb_text}</p>
          </span>
          <div className="flex flex-row">
            <span className="has-tooltip">
              <span className="tooltip rounded shadow-lg p-1 bg-gray-100">
                category
              </span>
              <img
                src="https://api.iconify.design/tabler:category-2.svg"
                className={"fill-amber-50 mr-2"}
                alt="update_every"
              />
            </span>
            <p className="text-xs text-gray-500 ">{output.category}</p>
          </div>
        </div>
        <div className="ml-2 flex flex-row items-center">
          <span className="has-tooltip">
            <span className="tooltip rounded shadow-lg p-1 bg-gray-100">
              update every X
            </span>
            <img
              src="https://api.iconify.design/lucide:between-horizontal-start.svg"
              className={"fill-amber-50 mr-2"}
              alt="update_every"
            />
          </span>
          <Input
            value={output.update_every.toString()}
            type="number"
            decimals={true}
            onChange={(value) =>
              changeUpdateRate({
                ...output,
                update_every: parseFloat(value as string),
              })
            }
          />

          {/* <p className="">{output.update_every}</p> */}
        </div>
      </div>
    </div>
  );
};
