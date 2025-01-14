import { Button } from "#components/elements/Button";
import { Header } from "#components/elements/header";
import { PartnerDevices } from "#partner_devices/PartnerDevices";
import { BundleSettingsHandler } from "#utils/BundleSettingsHandler";
import { message } from "@tauri-apps/plugin-dialog";
import { PartnerDevice } from "../models/PartnerDevice";
import { RunStateContext } from "#context/RunStateContext";
import { useContext } from "react";
import { TrackedDevicesHandler } from "#utils/TrackedDevicesHandler";

interface DeviceSettingsProps {
  setDialogOpen: (open: boolean) => void;
}

export const PartnerDeviceSettings = ({
  setDialogOpen,
}: DeviceSettingsProps) => {
  const context = useContext(RunStateContext);
  const { bundles, setBundles } = context;
  const devices: Array<PartnerDevice> = PartnerDevices;
  const bundleSettingsHandler = new BundleSettingsHandler();
  const trackedDevicesHandler = new TrackedDevicesHandler();

  const onAddToConnector = async (index: string) => {
    if (
      await bundleSettingsHandler.doesBundleExist(
        devices[parseInt(index)].bundle.name,
      )
    ) {
      await message("Bundle already present");
      return;
    }
    setBundles([...bundles, devices[parseInt(index)].bundle]);
    bundleSettingsHandler.addBundleSettings(devices[parseInt(index)].bundle);
    trackedDevicesHandler.addTrackedDevice(devices[parseInt(index)]);
    setDialogOpen(false);
  };
  return (
    <div className="w-[100%] h-[100%] min-h-[100%] min-w-[100%] -translate-y-1/2 -translate-x-1/2 fixed top-1/2 left-1/2 bg-opacity-50 z-50 flex flew-row align-middle justify-center items-center backdrop-blur-sm drop-shadow-lg">
      <div className="bg-transparent p-32 rounded-md">
        <div className="flex flex-col">
          {devices.map((device: PartnerDevice, index: number) => {
            return (
              <div
                key={index}
                className="flex flex-row justify-center items-center mb-4 shadow-blue-200 shadow p-4 rounded-md bg-white"
              >
                <img
                  src={device.imageUrl}
                  alt={device.name}
                  className="max-h-[150px] max-w-[200px] rounded-md mr-4"
                />
                <div className="flex flex-col items-start justify-start mr-4">
                  <Header
                    title={device.name}
                    level={2}
                    onLight={true}
                    withSubtitle={true}
                  />
                  <p className="text-gray-500 -mt-8">
                    made by: {device.madeBy}
                  </p>

                  <div className="flex flex-row">
                    <img
                      src="https://api.iconify.design/mdi:web.svg"
                      className={"fill-amber-50 mr-2 mt-4 cursor-pointer"}
                      alt="update_every"
                      onClick={() => {
                        open(device.productUrl);
                      }}
                    />
                    <img
                      src="https://api.iconify.design/mdi:github.svg"
                      className={"fill-amber-50 mr-2 mt-4 cursor-pointer"}
                      alt="update_every"
                      onClick={() => {
                        open(device.gitHubUrl);
                      }}
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <Button
                    text="Add to connector"
                    onClick={() => {
                      onAddToConnector(index.toString());
                      setDialogOpen(false);
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex flex-row">
          <Button
            text="close"
            onClick={() => {
              setDialogOpen(false);
            }}
          />
        </div>
      </div>
    </div>
  );
};
