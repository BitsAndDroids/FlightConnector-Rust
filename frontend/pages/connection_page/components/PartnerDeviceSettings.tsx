import { Button } from "#components/elements/Button.js";
import { Header } from "#components/elements/header.js";
import { PartnerDevices } from "#partner_devices/PartnerDevices.js";
import { PartnerDevice } from "../models/PartnerDevice";

interface DeviceSettingsProps {
  onConfirm: (input?: string) => void;
  setDialogOpen: (open: boolean) => void;
}

export const PartnerDeviceSettings = ({
  onConfirm,
  setDialogOpen,
}: DeviceSettingsProps) => {
  const devices: Array<PartnerDevice> = PartnerDevices;
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
                <div className="flex flex-col mr-4">
                  <Header
                    title={device.name}
                    level={2}
                    onLight={true}
                    addToClassName="mt-0"
                  />
                  <div className="text-gray-500 -mt-4">
                    made by: {device.madeBy}
                  </div>
                </div>
                <Button
                  text="Add to connector"
                  onClick={() => {
                    onConfirm(index.toString());
                    setDialogOpen(false);
                  }}
                />
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
