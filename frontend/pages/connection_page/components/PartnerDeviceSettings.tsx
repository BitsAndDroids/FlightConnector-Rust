import { Button } from "#components/elements/Button.js";
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
      <div className="bg-white p-32 rounded-md">
        <div className="flex flex-col">
          {devices.map((device: PartnerDevice, index: number) => {
            return (
              <div key={index} className="flex flex-row">
                <div className="flex flex-col">
                  <div>{device.name}</div>
                  <div>{device.madeBy}</div>
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
