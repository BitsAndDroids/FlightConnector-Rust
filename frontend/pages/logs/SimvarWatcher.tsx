import { RunStateContext } from "#context/RunStateContext.js";
import { Output } from "#model/Output.js";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { useContext, useEffect, useState } from "react";

interface simvar_update_message {
  number: number;
  value: string;
}

const createSimvarTable = async (vars: Map<number, string>) => {
  let outputs = await getOutputs();
  let table = document.createElement("table");
  vars.keys().forEach((outputID) => {
    let output: Output | undefined = outputs.find((o) => o.id === outputID);
    if (!output) {
      return;
    }
    table.appendChild(createSimvarRow(output));
  });
};

async function getOutputs() {
  return invoke("get_outputs").then((r) => {
    return r as Output[];
  });
}

const createSimvarRow = (output: Output) => {
  let row = document.createElement("tr");
  let simvarCell = document.createElement("td");
  simvarCell.textContent = output.simvar.toString();
  let valueCell = document.createElement("td");
  valueCell.textContent = "";
  row.appendChild(simvarCell);
  row.appendChild(valueCell);
  return row;
};

export const SimvarWatcher: React.FC = () => {
  const { currentRunBundle } = useContext(RunStateContext);
  const [simvarMap, setSimvarMap] = useState<Map<Output, string>>(
    new Map<Output, string>(),
  );

  useEffect(() => {
    const initSimvarMap = async () => {
      console.log(currentRunBundle);
      const outputsInBundle: Output[] =
        currentRunBundle.flatMap((bundle) => bundle?.bundle?.outputs || []) ||
        [];
      let outputMap = new Map<Output, string>();
      outputsInBundle.forEach((output) => {
        outputMap.set(output, "");
      });
      setSimvarMap(outputMap);
    };
    const handleSimvarUpdate = async () => {
      const unlisten = await listen<simvar_update_message>(
        "simvar_update",
        ({ payload }) => {},
      );
      return unlisten;
    };

    const unsubscribe = handleSimvarUpdate();
    initSimvarMap();
    return () => {
      unsubscribe.then((fn) => fn());
    };
  }, [currentRunBundle]);

  return (
    <div className="bg-bitsanddroids-blue h-screen w-screen p-4">
      <h1 className="mb-4 text-2xl font-bold tracking-tight text-white sm:text-4xl">
        Simvar watcher
      </h1>
      <table>
        <tbody>
          {Array.from(simvarMap.entries()).map(([id, value]) => (
            <tr key={id?.id}>
              <td>{id?.simvar}</td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
