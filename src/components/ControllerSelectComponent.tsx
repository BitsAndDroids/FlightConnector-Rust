"use client";
import React, { Suspense, useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Bundle } from "@/model/Bundle";
import { Preset } from "@/model/Preset";
import { ControllerSelect } from "./ControllerSelect";
import { BundleSettingsHander } from "@/utils/BundleSettingsHandler";
import { RunSettingsHandler } from "@/utils/runSettingsHandler";

export const ControllerSelectComponent = () => {
  useEffect(() => {
    async function getComPorts() {
      try {
        invoke("get_com_ports").then(async (result) => {
          setComPorts(result as string[]);
          setComPort((result as string[])[0]);
          let preset: Preset = defaultPreset;
          const amountOfConnections =
            await new RunSettingsHandler().getAmountOfConnections();
          const runBundles = [];
          for (let i = 0; i < amountOfConnections; i++) {
            console.log("adding row");
            runBundles.push({
              id: i,
              com_port: (result as string[])[0],
              bundle: { name: "", outputs: [], version: 0 },
            });
          }
          setDefaultPreset({
            ...preset,
            runBundles: runBundles,
          });
        });
      } catch (e) {
        console.log(e);
      }
    }
    async function getLastPreset() {
      const runSettingsHandler = new RunSettingsHandler();
      const lastPreset = await runSettingsHandler.getLastPreset();
      if (lastPreset) {
        setDefaultPreset(lastPreset);
        setPreset(lastPreset);
      }
    }

    async function getBundles() {
      let bundleSettingsHandler = new BundleSettingsHander();
      let bundles = await bundleSettingsHandler.getSavedBundles();
      setBundles(bundles);
    }

    getComPorts().then(() => {
      getBundles();
      getLastPreset();
      setLoaded(true);
    });
  }, []);

  const [comPorts, setComPorts] = useState<string[]>([]);
  const [connectionRunning, setConnectionRunning] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [comPort, setComPort] = useState<string>("");
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [defaultPreset, setDefaultPreset] = useState<Preset>({
    name: "default",
    runBundles: [
      {
        id: 0,
        com_port: comPorts[0],
        bundle: { name: "", outputs: [], version: 0 },
      },
    ],
    version: "1.0",
    id: 0,
  });
  const [preset, setPreset] = useState<Preset>();
  const addRow = () => {
    let presetToAlter: Preset = preset ? preset : defaultPreset;
    let newPreset = { ...presetToAlter };
    newPreset.runBundles.push({
      id: newPreset.runBundles.length + 1,
      com_port: "",
      bundle: { name: "", outputs: [], version: 0 },
    });
    if (preset) setPreset(newPreset);
    else setDefaultPreset(newPreset);
  };

  const deleteRow = (id: number) => {
    let presetToAlter: Preset = preset ? preset : defaultPreset;
    let newPreset = { ...presetToAlter };
    newPreset.runBundles = presetToAlter.runBundles.filter(
      (runBundle) => runBundle.id !== id,
    );
    if (preset) setPreset(newPreset);
    else setDefaultPreset(newPreset);
  };

  function toggleRunConnection() {
    if (connectionRunning) {
      invoke("stop_simconnect_connection");
    } else {
      const runSettingsHandler = new RunSettingsHandler();
      invoke("start_simconnect_connection", {
        runBundles: defaultPreset.runBundles,
      }).then((result) => {
        console.log(result);
        runSettingsHandler.setAmountOfConnections(
          defaultPreset.runBundles.length,
        );
      });
      runSettingsHandler.setLastPreset(defaultPreset);
    }
    setConnectionRunning(!connectionRunning);
  }

  function setComPortForRunBundle(comPort: string, runBundle: any) {
    let newPreset = { ...getPresetOrDefault() };
    newPreset.runBundles = newPreset.runBundles.map((bundle) => {
      if (bundle.id === runBundle.id) {
        bundle.com_port = comPort;
      }
      return bundle;
    });
    if (preset) setPreset(newPreset);
    else setDefaultPreset(newPreset);
  }

  function setBundleForRunBundle(bundleName: string, runBundle: any) {
    let newPreset = { ...getPresetOrDefault() };
    newPreset.runBundles = newPreset.runBundles.map((rb) => {
      if (bundleName === "No outputs") {
        rb.bundle = { name: "No outputs", outputs: [], version: 0 };
        return rb;
      }
      if (runBundle.id === rb.id) {
        const bundleAltered = bundles.find((b) => b.name === bundleName);
        if (!bundleAltered)
          throw new Error(
            "this bundle doesn't exist in the bundle list... This shouldn't be possible",
          );
        rb.bundle = bundleAltered;
      }
      return rb;
    });
    setPresetOrDefault(newPreset);
  }

  function setPresetOrDefault(alteredPreset: Preset) {
    if (preset) setPreset(alteredPreset);
    else setDefaultPreset(alteredPreset);
  }

  function getPresetOrDefault() {
    let presetToReturn: Preset = defaultPreset;
    if (preset) presetToReturn = preset;
    return presetToReturn;
  }

  return (
    <>
      {loaded && (
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
              type="button"
              className={`${connectionRunning ? "bg-red-700" : "bg-emerald-800"} rounded-md bg-indigo-500 px-3.5 py-2.5 m-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400`}
              onClick={toggleRunConnection}
            >
              {connectionRunning ? "Stop" : "Start"}
            </button>
          </div>
          <div className="flex flex-row font-bold text-white">
            <p className="ml-2">Com port</p>
            <p className="ml-24">Bundle</p>
          </div>
          {preset &&
            preset.runBundles.map((runBundle) => (
              <ControllerSelect
                bundles={bundles}
                selectedBundle={runBundle.bundle}
                comPorts={comPorts}
                selectedComPort={comPort}
                setComPort={setComPortForRunBundle}
                setBundle={setBundleForRunBundle}
                runBundle={runBundle}
                removeRow={deleteRow}
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
                setComPort={setComPortForRunBundle}
                setBundle={setBundleForRunBundle}
                runBundle={runBundle}
                removeRow={deleteRow}
                key={Math.random()}
              />
            ))}
        </div>
      )}
    </>
  );
};
