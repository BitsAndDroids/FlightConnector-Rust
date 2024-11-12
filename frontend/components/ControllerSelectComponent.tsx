import {
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { invoke } from "#tauri/invoke";
import { Bundle } from "@/model/Bundle";
import { Preset } from "@/model/Preset";
import { ControllerSelect } from "./ControllerSelect";
import { BundleSettingsHandler } from "@/utils/BundleSettingsHandler";
import { RunSettingsHandler } from "@/utils/runSettingsHandler";
import { PresetSettingsHandler } from "@/utils/PresetSettingsHandler";
import { listen } from "@tauri-apps/api/event";
import { RunBundlePopulated, populateRunBundles } from "@/model/RunBundle";
import PresetControls from "./presets/PresetControls";
import { RunStateContext } from "#context/RunStateContext.js";
import { PartnerDeviceSettings } from "#pages/connection_page/components/PartnerDeviceSettings.js";

async function invokeConnection(
  preset: Preset,
  runBundles: RunBundlePopulated[],
) {
  if (!preset) {
    return;
  }
  if (process.env.NODE_ENV !== "production") {
    invoke("start_simconnect_connection", {
      runBundles: runBundles,
      presetId: preset.id,
      debug: true,
    });
    return;
  }
  invoke("start_simconnect_connection", {
    runBundles: runBundles,
    presetId: preset.id,
    debug: false,
  });
}
interface Connections {
  name: string;
  connected: boolean;
  id: number;
}
export const ControllerSelectComponent = () => {
  const defaultPreset = (com: string) => ({
    name: "default",
    runBundles: [
      {
        id: 0,
        com_port: com,
        bundle_name: "",
        connected: false,
      },
    ],
    version: "1.0",
    id: "0",
  });

  let firstBoot = useRef(true);
  const presetSettingsHandler = useRef(new PresetSettingsHandler());

  const runSettingsHandler = useRef(new RunSettingsHandler());
  const context = useContext(RunStateContext);
  const { connectionRunning, setConnectionRunning } = context;
  const [loaded, setLoaded] = useState<boolean>(false);
  const [comPorts, setComPorts] = useState<string[]>([]);

  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [unlisten, setUnlisten] = useState<any>();
  const [preset, setPreset] = useState<Preset>();
  const [presets, setPresets] = useState<Preset[]>();
  const setConnected = useCallback(
    (connected: boolean, id: number) => {
      if (!preset) {
        return;
      }
      let newPreset = { ...preset };
      newPreset.runBundles = newPreset.runBundles?.map((runBundle) => {
        if (runBundle.id === id) {
          runBundle.connected = connected;
        }
        return runBundle;
      });
      setPreset(newPreset);
    },
    [preset],
  );

  const toggleRunConnection = useCallback(async () => {
    const resetAllConnections = () => {
      if (!preset) {
        return;
      }
      let newPreset = { ...preset };
      newPreset.runBundles = newPreset.runBundles?.map((runBundle) => {
        runBundle.connected = false;
        return runBundle;
      });
      setPreset(newPreset);
    };
    const startEventListeners = () => {
      setUnlisten(
        listen<Connections>("connection_event", (event) => {
          setConnected(event.payload.connected, event.payload.id);
        }),
      );
    };
    if (connectionRunning) {
      unlisten && unlisten.then((unlisten: any) => unlisten());
      invoke("stop_simconnect_connection");
      resetAllConnections();
    } else {
      if (!preset) {
        return;
      }
      startEventListeners();

      runSettingsHandler.current.setLastPresetId(preset.id);
      await invokeConnection(
        preset,
        await populateRunBundles(preset.runBundles),
      );
    }
    setConnectionRunning(!connectionRunning);
  }, [
    connectionRunning,
    unlisten,
    preset,
    runSettingsHandler,
    setConnected,
    setConnectionRunning,
  ]);

  const initPresets = useCallback(async () => {
    const lastPreset = await getActivePreset();
    if (lastPreset) {
      let newPreset = { ...lastPreset };
      newPreset.runBundles = newPreset?.runBundles?.map((runBundle) => {
        if (!runBundle.com_port) {
          runBundle.com_port = comPorts[0];
        }
        return runBundle;
      });
      updatePresets(newPreset);
    } else {
      setPresets([defaultPreset(comPorts[0])]);
      updatePresets(defaultPreset(comPorts[0]));
    }
  }, [comPorts]);

  async function getActivePreset(): Promise<Preset | undefined> {
    const lastPresetId = await runSettingsHandler.current.getLastPresetId();
    if (lastPresetId) {
      const lastPresetId = await runSettingsHandler.current.getLastPresetId();
      if (!lastPresetId) {
        return;
      }
      const lastPreset =
        await presetSettingsHandler.current.getPreset(lastPresetId);
      if (lastPreset) {
        return lastPreset;
      }
    }
  }

  useEffect(() => {
    if (loaded && preset && firstBoot.current) {
      invoke("launch_on_startup").then((result) => {
        firstBoot.current = false;
        if (result) {
          toggleRunConnection();
        }
      });
    }
  }, [loaded, preset, toggleRunConnection]);

  useEffect(() => {
    async function getBundles() {
      let bundleSettingsHandler = new BundleSettingsHandler();
      let bundles = await bundleSettingsHandler.getSavedBundles();
      setBundles(bundles);
    }

    async function getPresets() {
      const presets = await presetSettingsHandler.current.getAllPresets();
      if (presets.length > 0) {
        setPresets(presets);
      } else {
        await presetSettingsHandler.current.addPreset(
          defaultPreset(comPorts[0]),
        );
      }
    }

    async function getComPorts() {
      try {
        invoke("get_com_ports").then(async (result) => {
          const comPorts = (await result) as string[];
          if (comPorts.length == 0) {
            setComPorts(["No com ports"]);
            return;
          }
          setComPorts(result as string[]);
        });
      } catch (e) {
        console.log(e);
      }
    }

    async function init() {
      await getBundles();
      await initPresets();
      await getPresets();
      setLoaded(true);
    }

    if (comPorts.length == 0) {
      getComPorts();
    }
    if (!loaded && comPorts.length > 0) {
      init();
    }
  }, [comPorts, initPresets, loaded]);

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

  function onChangePreset(newPreset: Preset) {
    runSettingsHandler.current.setLastPresetId(newPreset.id);
    setPreset(newPreset);
  }

  function setComPortForRunBundle(comPort: string, runBundle: any) {
    if (!preset) {
      return;
    }
    let set = preset;
    let newPreset = { ...set };

    newPreset.runBundles = newPreset?.runBundles?.map((bundle) => {
      if (bundle.id === runBundle.id) {
        bundle.com_port = comPort;
      }
      return bundle;
    });
    updatePresets(newPreset);
  }

  function updatePresets(presetUpdate: Preset) {
    presetSettingsHandler.current.updatePreset(presetUpdate);
    setPreset(presetUpdate);
  }

  function setBundleForRunBundle(bundleName: string, runBundle: any) {
    if (!preset) {
      return;
    }
    let set = preset;
    let newPreset = { ...set };
    newPreset.runBundles = newPreset?.runBundles?.map((rb) => {
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
    <Suspense>
      <>
        {((loaded && preset && presets) ||
          process.env.NODE_ENV !== "production") && (
          <div className="flex flex-col items-start">
            <div className={"flex flex-col"}>
              <div className={"flex flex-row"}>
                <button
                  type="button"
                  data-testid="start_stop_button"
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
            {!preset ? (
              <ControllerSelect
                data-testid="controller_select"
                bundles={[]}
                comPorts={[]}
                selectedComPort=""
                setComPort={setComPortForRunBundle}
                setBundle={setBundleForRunBundle}
                runBundle={undefined}
                removeRow={deleteRow}
                key={Math.random()}
              />
            ) : (
              <>
                {preset?.runBundles?.map((runBundle) => (
                  <ControllerSelect
                    data-testid="controller_select"
                    bundles={bundles}
                    comPorts={comPorts}
                    selectedComPort={runBundle.com_port}
                    setComPort={setComPortForRunBundle}
                    setBundle={setBundleForRunBundle}
                    runBundle={runBundle}
                    removeRow={deleteRow}
                    key={Math.random()}
                  />
                ))}
              </>
            )}
          </div>
        )}
      </>
    </Suspense>
  );
};
