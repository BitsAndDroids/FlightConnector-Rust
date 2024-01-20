import { Category } from "@/model/Category";
import { Output } from "@/model/Output";
import { useState } from "react";

interface Props {
  category: Category,
  toggleOutput: (output: Output) => void,
}

const OutputCategory = ({ category, toggleOutput }: Props) => {

  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [outputs, setOutputs] = useState<Output[]>(category.outputs);

  function toggleOutputState(outputChanged: Output) {
    // Change selected state of output
    let newOutputs = outputs.map(output => {
      if (output.output_name === outputChanged.output_name) {
        return { ...output, selected: !output.selected }; // Returning a new object here
      }
      return output; // If not the matching output, return the original
    });

    setOutputs(newOutputs);
    toggleOutput(outputChanged);
  }


  return (
    <>
      <div className="flex flex-row">
        <h2 className="text-white text-xl my-2">{category.name}</h2>
        <button type="button" className="text-white rounded-m ml-4 text-sm" onClick={() => setCollapsed(!collapsed)}>{collapsed ? "Show" : "Hide"}</button>
      </div>
      {!collapsed &&

        outputs.map((output) => {
          return (
            <div className="flex flex-row ml-4" key={output.output_name}>
              <input
                className="text-white"
                type="checkbox"
                id={output.output_name}
                name={output.output_name}
                onChange={() => toggleOutputState(output)}
                value={output.output_name}
                checked={output.selected}
              />

              <label className="text-white ml-2 mr-4" htmlFor={output.output_name}>{output.output_name.toLowerCase()}</label>
            </div>
          )
        })
      }
      ) : <></>
    </>
  )

};

export default OutputCategory;
