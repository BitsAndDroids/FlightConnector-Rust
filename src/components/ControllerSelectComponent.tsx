"use client";
import React, { useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Bundle } from "@/model/Bundle";
import { Preset } from "@/model/Preset";
import { ControllerSelect } from "./ControllerSelect";
import { BundleSettingsHandler } from "@/utils/BundleSettingsHandler";
import { RunSettingsHandler } from "@/utils/runSettingsHandler";
import { PresetSettingsHandler } from "@/utils/PresetSettingsHandler";
import { listen } from "@tauri-apps/api/event";
import { RunBundlePopulated, populateRunBundles } from "@/model/RunBundle";
import PresetControls from "./presets/PresetControls";
interface Connections {
  name: string;
  connected: boolean;
  id: number;
}
export const ControllerSelectComponent = () => {
  const defaultPreset = {
    name: "default",
    runBundles: [
      {
        id: 0,
        com_port: "",
        bundle_name: "",
        connected: false,
      },
    ],
    version: "1.0",
    id: "0",
  };

  const [connectionRunning, setConnectionRunning] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [comPorts, setComPorts] = useState<string[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [unlisten, setUnlisten] = useState<any>();
  const [preset, setPreset] = useState<Preset>();
  const [presets, setPresets] = useState<Preset[]>();

  function startEventListeners() {
    setUnlisten(
      listen<Connections>("connection_event", (event) => {
        setConnected(event.payload.connected, event.payload.id);
      }),
    );
  }

  useEffect(() => {
    if (loaded) {
      invoke("launch_on_startup").then((result) => {
        if (result) {
          toggleRunConnection();
        }
      });
    }
  }, [loaded]);

  async function getActivePreset(): Promise<Preset | undefined> {
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
        return lastPreset;
      }
    }
  }

  useEffect(() => {
    async function getComPorts() {
      try {
        invoke("get_com_ports").then(async (result) => {
          setComPorts(result as string[]);
        });
      } catch (e) {
        console.log(e);
      }
    }

    async function getBundles() {
      let bundleSettingsHandler = new BundleSettingsHandler();
      let bundles = await bundleSettingsHandler.getSavedBundles();
      setBundles(bundles);
    }

    async function getPresets() {
      const presetSettingsHandler = new PresetSettingsHandler();
      const presets = await presetSettingsHandler.getAllPresets();
      if (presets.length > 0) {
        setPresets(presets);
      } else {
        await presetSettingsHandler.addPreset(defaultPreset);
      }
    }

    getComPorts().then(() => {
      getBundles();
      getActivePreset().then((lastPreset) => {
        if (lastPreset) {
          let newPreset = { ...lastPreset };
          newPreset.runBundles = newPreset.runBundles.map((runBundle) => {
            if (!runBundle.com_port) {
              runBundle.com_port = comPorts[0];
            }
            return runBundle;
          });
          setPreset(newPreset);
          updatePresets(newPreset);
        }
      });
      getPresets();
      setLoaded(true);
    });
  }, []);

  const resetAllConnections = () => {
    if (!preset) {
      return;
    }
    let newPreset = { ...preset };
    newPreset.runBundles = newPreset.runBundles.map((runBundle) => {
      runBundle.connected = false;
      return runBundle;
    });
    setPreset(newPreset);
  };

  const setConnected = (connected: boolean, id: number) => {
    if (!preset) {
      return;
    }
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
    if (!preset) {
      return;
    }
    let newPreset = { ...preset };
    newPreset.runBundles = newPreset.runBundles.filter(
      (runBundle) => runBundle.id !== id,
    );
    updatePresets(newPreset);
  };

  async function invokeConnection(runBundles: RunBundlePopulated[]) {
    if (!preset) {
      return;
    }
    invoke("start_simconnect_connection", {
      runBundles: runBundles,
      presetId: preset.id,
    });
  }

  async function toggleRunConnection() {
    if (connectionRunning) {
      unlisten && unlisten.then((unlisten: any) => unlisten());
      invoke("stop_simconnect_connection");
      resetAllConnections();
    } else {
      startEventListeners();
      const activePreset = await getActivePreset();
      if (activePreset) {
        if (activePreset) {
          await invokeConnection(
            await populateRunBundles(activePreset.runBundles),
          );
        }
      } else {
        if (!preset) {
          return;
        }
        preset.runBundles.map((runBundle, index) => {
          if (!runBundle.com_port) {
            let newPreset = { ...preset };
            newPreset.runBundles[index].com_port = comPorts[0];
            updatePresets(newPreset);
          }
        });
        await invokeConnection(await populateRunBundles(preset.runBundles));
      }
    }
    setConnectionRunning(!connectionRunning);
  }

  function onChangePreset(newPreset: Preset) {
    const runSettingsHandler = new RunSettingsHandler();
    runSettingsHandler.setLastPresetId(newPreset.id);
    setPreset(newPreset);
  }

  function setComPortForRunBundle(comPort: string, runBundle: any) {
    if (!preset) {
      return;
    }
    let set = preset;
    let newPreset = { ...set };

    newPreset.runBundles = newPreset.runBundles.map((bundle) => {
      if (bundle.id === runBundle.id) {
        bundle.com_port = comPort;
      }
      return bundle;
    });
    updatePresets(newPreset);
  }

  function updatePresets(presetUpdate: Preset) {
    const presetSettingsHandler = new PresetSettingsHandler();
    presetSettingsHandler.updatePreset(presetUpdate);
    setPreset(presetUpdate);
  }

  function setBundleForRunBundle(bundleName: string, runBundle: any) {
    if (!preset) {
      return;
    }
    let set = preset;
    let newPreset = { ...set };
    newPreset.runBundles = newPreset.runBundles.map((rb) => {
      if (bundleName === "No outputs") {
        if (rb.id === runBundle.id) {
          rb.bundle_name = "";
          return rb;
        }
      }
      if (rb.id === runBundle.id) {
        const bundleAltered = bundles.find((b) => b.name === bundleName);
        if (!bundleAltered)
          throw new Error(
            "this bundle doesn't exist in the bundle list... This shouldn't be possible",
          );
        rb.bundle_name = bundleAltered.name;
      }
      return rb;
    });
    updatePresets(newPreset);
  }

  return (
    <>
      {loaded && preset && presets && (
        <div className="flex flex-col items-start">
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

          <div className="flex flex-row w-full font-bold text-white">
            <p className="ml-2">Com port</p>
            <p className="ml-24">Bundle</p>
          </div>
          {preset &&
            preset.runBundles.map((runBundle, index) => (
              <ControllerSelect
                bundles={bundles}
                comPorts={comPorts}
                selectedComPort={preset.runBundles[index].com_port}
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
