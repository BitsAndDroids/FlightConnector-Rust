import { Header } from "@/components/elements/header";
import { RunComponent } from "../components/RunComponent";
import { UpdateWindow } from "@/components/update/UpdateWindow";
import { useEffect, useState } from "react";
import { check, onUpdaterEvent } from "@tauri-apps/plugin-updater";
import { listen } from "@tauri-apps/api/event";
export default function HomePage() {
  const [updateWindowVisible, setUpdateWindowVisible] =
    useState<boolean>(false);
  const [updateAvailable, setUpdateAvailable] = useState<boolean>(false);

  useEffect(() => {
    check().then((res) => {
      console.log("Checking for updates");
      console.log(res);
    });
  }, []);
  return (
    <div className="flex justify-center align-middle  h-full w-full flex-col ">
      {updateWindowVisible && <UpdateWindow />}
      <div className="flex flex-col justify-center align-middle items-center">
        <Header level={1} title="FLIGHT CONNECTOR" />
      </div>
      <RunComponent />
    </div>
  );
}
