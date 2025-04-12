import { RunStateContext } from "#context/RunStateContext.js";
import { Output } from "#model/Output.js";
import { RunBundlePopulated } from "#model/RunBundle.js";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { useContext, useEffect, useState } from "react";

interface simvar_update_message {
  id: number;
  value: number;
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
  const [runBundles, setRunBundles] = useState<Array<RunBundlePopulated>>([]);
  const [simvarMap, setSimvarMap] = useState<Map<number, Output>>(
    new Map<number, Output>(),
  );

  useEffect(() => {
    const initSimvarMap = async () => {
      const outputsInBundle: Output[] =
        runBundles.flatMap((bundle) => bundle?.bundle?.outputs || []) || [];
      let outputMap = new Map<number, Output>();
      outputsInBundle.forEach((output) => {
        outputMap.set(output.id, output);
      });
      setSimvarMap(outputMap);
    };
    const handleOutputInvocations = async () => {
      const unlisten = await listen<any>("runbundles_active", ({ payload }) => {
        console.log("outputs_active", payload);
        setRunBundles(payload.runBundles);
      });
      return unlisten;
    };
    const handleSimvarUpdate = async () => {
      const unlisten = await listen<any>("simvar_update", ({ payload }) => {
        console.log("simvar_update", payload);
        setSimvarMap((prevmap) =>
          new Map(prevmap).set(payload.id, {
            ...prevmap.get(payload.id)!,
            value: payload.value,
          }),
        );
      });
      return unlisten;
    };

    const unsubscribe = handleSimvarUpdate();
    const unsubscribeOutputsListener = handleOutputInvocations();
    initSimvarMap();
    return () => {
      unsubscribe.then((fn) => fn());
      unsubscribeOutputsListener.then((fn) => fn());
    };
  }, [runBundles]);

  return (
    <div className="bg-bitsanddroids-blue min-h-screen h-screen w-screen p-4 flex flex-col">
      <h1 className="mb-4 text-2xl font-bold tracking-tight text-white sm:text-4xl">
        Simvar watcher
      </h1>
      <div className="p-4 flex-1 max-h-[550px]">
        <div className="bg-white rounded-lg max-h-[500px] overflow-y-scroll overflow-x-hidden">
          <table className="w-full m-2 rounded-lg">
            <tbody className="p-4">
              {Array.from(simvarMap.entries()).map(([id, output]) => (
                <tr key={output?.id} className="bg-white border-t">
                  <td className="w-1/2 p-2 font-bold">{output?.simvar}</td>
                  <td>{output.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
