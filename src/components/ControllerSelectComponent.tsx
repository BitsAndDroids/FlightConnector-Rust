import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { listen } from "@tauri-apps/api/event";
import { ControllerSelect } from "@/components/ControllerSelect";
import { Bundle } from "@/model/Bundle";
import { BundleSettingsHander } from "@/utils/BundleSettingsHandler";

export const ControllerSelectComponent = () => {
  type Payload = {
    message: string;
  };

  const [comPorts, setComPorts] = useState<string[]>([]);
  const [comPort, setComPort] = useState<string>("");
  const [data, setData] = useState<string>("");
  const [bundles, setBundles] = useState<Bundle[]>([]);
  useEffect(() => {
    async function getComPorts() {
      const ports = await invoke("get_com_ports");
      setComPort((ports as string[])[0]);
      setComPorts(ports as string[]);
    }

    async function getData() {
      await listen<Payload>("event-name", (event) => {
        console.log(event.payload.message);
        setData(event.payload.message);
      });
    }

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
        {comPorts.map((port) => (
          <ControllerSelect
            bundles={bundles}
            comPorts={comPorts}
            setComPort={setComPort}
            key={Math.random()}
          />
        ))}
      </div>
    </>
  );
};

