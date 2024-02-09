import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { listen } from "@tauri-apps/api/event";
import { ControllerSelect } from "@/components/ControllerSelect";
import { Bundle } from "@/model/Bundle";
import { BundleSettingsHander } from "@/utils/BundleSettingsHandler";
import { RunBundle } from "@/model/RunBundle";
import { Preset } from "@/model/Preset";

export const ControllerSelectComponent = () => {
  type Payload = {
    message: string;
  };

  const [comPorts, setComPorts] = useState<string[]>([]);
  const [comPort, setComPort] = useState<string>("");
  const [data, setData] = useState<string>("");
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [defaultPreset, setDefaultPreset] = useState<Preset>({
    name: "default",
    runBundles: [
      { id: 0, comport: "", bundle: { name: "", outputs: [], version: 0 } },
    ],
    version: "1.0",
    id: 0,
  });
  const [preset, setPreset] = useState<Preset>();
  const addRow = () => {
    let presetToAlter: Preset = preset ? preset : defaultPreset;
    let newPreset = { ...presetToAlter };
    newPreset.runBundles.push({
      id: 0,
      comport: "",
      bundle: { name: "", outputs: [], version: 0 },
    });
    if (preset) setPreset(newPreset);
    else setDefaultPreset(newPreset);
  };

  useEffect(() => {
    async function getComPorts() {
      const ports = await invoke("get_com_ports");
      setComPort((ports as string[])[0]);
      setComPorts(ports as string[]);
    }

    async function getData() {}

    async function getBundles() {
      let bundleSettingsHandler = new BundleSettingsHander();
      let bundles = await bundleSettingsHandler.getSavedBundles();
      setBundles(bundles);
    }

    getBundles();
    getData();
    //test
    getComPorts();
  }, []);

  return (
    <>
      <div>
        <div className={"flex flex-row"}>
          <button
            type="button"
            className={
              "rounded-md bg-green-900 text-white text-sm font-semibold px-3.5 py-2.5 m-2"
            }
            onClick={addRow}
          >
            Add row
          </button>
          <button
            type="submit"
            className={
              "rounded-md bg-indigo-500 px-3.5 py-2.5 m-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
            }
          >
            Start
          </button>
        </div>
        <div className="flex flex-row font-bold text-white">
          <p className="ml-2">Com port</p>
          <p className="ml-6">Bundle</p>
        </div>
        {preset &&
          preset.runBundles.map((runBundle) => (
            <ControllerSelect
              bundles={bundles}
              selectedBundle={runBundle.bundle}
              comPorts={comPorts}
              selectedComPort={comPort}
              setComPort={setComPort}
              key={Math.random()}
            />
          ))}
        {!preset &&
          defaultPreset.runBundles.map((runBundle) => (
            <ControllerSelect
              bundles={bundles}
              selectedBundle={runBundle.bundle}
              comPorts={comPorts}
              selectedComPort={comPort}
              setComPort={setComPort}
              key={Math.random()}
            />
          ))}
      </div>
    </>
  );
};
