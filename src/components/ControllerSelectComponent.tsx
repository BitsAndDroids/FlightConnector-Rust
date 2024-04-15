"use client";
import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Bundle } from "@/model/Bundle";
import { Preset } from "@/model/Preset";
import { ControllerSelect } from "./ControllerSelect";
import { BundleSettingsHander } from "@/utils/BundleSettingsHandler";
import { RunSettingsHandler } from "@/utils/runSettingsHandler";
import PresetControls from "./presets/PresetControls";
import { PresetSettingsHandler } from "@/utils/PresetSettingsHandler";
import { listen } from "@tauri-apps/api/event";
interface ControllerSelectComponentProps {}
interface Connections {
  name: string;
  connected: boolean;
  id: number;
}
export const ControllerSelectComponent = (
  props: ControllerSelectComponentProps,
) => {
  const [connectionRunning, setConnectionRunning] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [comPorts, setComPorts] = useState<string[]>([]);
  const [comPort, setComPort] = useState<string>("");
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [preset, setPreset] = useState<Preset>({
    name: "default",
    runBundles: [
      {
        id: 0,
        com_port: comPorts[0],
        bundle: { name: "", outputs: [], version: 0 },
        connected: false,
      },
    ],
    version: "1.0",
    id: "0",
  });
  const [presets, setPresets] = useState<Preset[]>([preset]);
  async function startConnectionEventListener() {
    await listen<Connections>("connection_event", (event) => {
      console.log(event);
      setConnected(event.payload.connected, event.payload.id);
    });
  }
  useEffect(() => {
    async function getComPorts() {
      try {
        invoke("get_com_ports").then(async (result) => {
          setComPorts(result as string[]);
          setComPort((result as string[])[0]);
        });
      } catch (e) {
        console.log(e);
      }
    }

    async function getLastPreset() {
      const runSettingsHandler = new RunSettingsHandler();
      const lastPreset = await runSettingsHandler.getLastPresetId();
      if (lastPreset) {
        const presetSettingsHandler = new PresetSettingsHandler();
        const lastPresetId = await runSettingsHandler.getLastPresetId();
        if (!lastPresetId) {
          return;
        }
        const lastPreset = await presetSettingsHandler.getPreset(lastPresetId);
        if (lastPreset) {
          setPreset(lastPreset);
        }
      }
    }

    async function getBundles() {
      let bundleSettingsHandler = new BundleSettingsHander();
      let bundles = await bundleSettingsHandler.getSavedBundles();
      setBundles(bundles);
    }

    async function getPresets() {
      const presetSettingsHandler = new PresetSettingsHandler();
      const presets = await presetSettingsHandler.getAllPresets();
      if (presets.length > 0) {
        setPresets(presets);
      } else {
        const defaultPreset = {
          name: "default",
          runBundles: [
            {
              id: 0,
              com_port: comPorts[0],
              bundle: { name: "", outputs: [], version: 0 },
              connected: false,
            },
          ],
          version: "1.0",
          id: "0",
        };
        presetSettingsHandler.addPreset(defaultPreset);
        setPreset(defaultPreset);
      }
    }

    getComPorts().then(() => {
      getBundles();
      getLastPreset();
      getPresets();
      setLoaded(true);
    });
  }, []);

  const resetAllConnections = () => {
    let newPreset = { ...preset };
    newPreset.runBundles = newPreset.runBundles.map((runBundle) => {
      runBundle.connected = false;
      return runBundle;
    });
    setPreset(newPreset);
  };

  const setConnected = (connected: boolean, id: number) => {
    let newPreset = { ...preset };
    newPreset.runBundles = newPreset.runBundles.map((runBundle) => {
      if (runBundle.id === id) {
        runBundle.connected = connected;
      }
      return runBundle;
    });
    setPreset(newPreset);
  };

  const deleteRow = (id: number) => {
    let newPreset = { ...preset };
    newPreset.runBundles = newPreset.runBundles.filter(
      (runBundle) => runBundle.id !== id,
    );
    setPreset(newPreset);
  };

  function toggleRunConnection() {
    if (connectionRunning) {
      invoke("stop_simconnect_connection");
      resetAllConnections();
    } else {
      invoke("start_simconnect_connection", {
        runBundles: preset.runBundles,
      }).then((result) => {
        console.log(result);
      });
    }
    startConnectionEventListener();
    setConnectionRunning(!connectionRunning);
  }

  function onChangePreset(preset: Preset) {
    const runSettingsHandler = new RunSettingsHandler();
    runSettingsHandler.setLastPresetId(preset.id);
    setPreset(preset);
  }

  function setComPortForRunBundle(comPort: string, runBundle: any) {
    let set = preset;
    let newPreset = { ...set };

    newPreset.runBundles = newPreset.runBundles.map((bundle) => {
      if (bundle.id === runBundle.id) {
        bundle.com_port = comPort;
      }
      return bundle;
    });
    setPreset(newPreset);
  }

  function setBundleForRunBundle(bundleName: string, runBundle: any) {
    let set = preset;
    let newPreset = { ...set };
    newPreset.runBundles = newPreset.runBundles.map((rb) => {
      if (bundleName === "No outputs") {
        if (rb.id === runBundle.id) {
          rb.bundle = { name: "No outputs", outputs: [], version: 0 };
          return rb;
        }
      }
      if (rb.id === runBundle.id) {
        const bundleAltered = bundles.find((b) => b.name === bundleName);
        if (!bundleAltered)
          throw new Error(
            "this bundle doesn't exist in the bundle list... This shouldn't be possible",
          );
        rb.bundle = bundleAltered;
      }
      return rb;
    });
    setPreset(newPreset);
  }

  return (
    <>
      {loaded && (
        <div>
          <div className={"flex flex-col"}>
            <div className={"flex flex-row"}>
              <button
                type="button"
                className={`${connectionRunning ? "bg-red-700 hover:bg-red-800" : "bg-green-600 hover:bg-green-800"} rounded-md bg-green-600 px-3.5 py-2.5 m-2 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400`}
                onClick={toggleRunConnection}
              >
                {connectionRunning ? "Stop" : "Start"}
              </button>
            </div>
            <PresetControls
              setPreset={onChangePreset}
              activePreset={preset}
              setPresets={setPresets}
              presets={presets}
            />
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
        </div>
      )}
    </>
  );
};
