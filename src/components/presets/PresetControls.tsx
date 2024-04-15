import { v4 as uuidv4 } from "uuid";
import { PresetSettingsHandler } from "@/utils/PresetSettingsHandler";
import InputDialog from "../InputDialog";
import { useState } from "react";
import { Preset } from "@/model/Preset";

interface PresetControlsProps {
  setPreset: (preset: Preset) => void;
  setPresets: (presets: Preset[]) => void;
  activePreset: Preset;
  presets: Preset[];
}

export const PresetControls = (props: PresetControlsProps) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const presetSettingsHandler = new PresetSettingsHandler();
  async function updatePreset() {
    presetSettingsHandler.updatePreset(props.activePreset);
  }
  const addRow = () => {
    let presetToAlter: Preset = props.activePreset;
    let newPreset = { ...presetToAlter };
    newPreset.runBundles.push({
      id: newPreset.runBundles.length + 1,
      com_port: "",
      bundle_name: "",
      connected: false,
    });
    props.setPreset(newPreset);
  };

  async function createPreset() {
    setDialogOpen(true);
  }
  async function dialogResult(input?: string) {
    const newUuid = uuidv4();

    if (input !== undefined) {
      let newPreset: Preset = {
        id: newUuid,
        version: "1",
        name: input,
        runBundles: [
          {
            id: 0,
            com_port: "",
            bundle_name: "",
            connected: false,
          },
        ],
      };
      props.setPreset(newPreset);
      props.setPresets([...props.presets, newPreset]);
      presetSettingsHandler.addPreset(newPreset);
    }
    setDialogOpen(false);
  }

  return (
    <>
      {dialogOpen && (
        <InputDialog
          message={"Enter the name of the new preset"}
          onConfirm={dialogResult}
        />
      )}
      <div className={"flex flex-row"}>
        <button
          type="button"
          className={
            "rounded-md bg-green-600 text-white text-sm font-semibold px-3.5 py-2.5 m-2 flex flex-row items-center"
          }
          onClick={() => {
            updatePreset();
          }}
        >
          {" "}
          <img src="save.svg" alt="save" className="w-4 h-4 mr-2" />
          Save preset{" "}
        </button>
        <select
          key={Math.random()}
          className="rounded-lg h-10 mt-2 px-4"
          value={props.activePreset.id}
          onChange={async (e) => {
            let preset = await presetSettingsHandler.getPresetById(
              e.currentTarget.value,
            );
            if (preset) {
              props.setPreset(preset);
            }
          }}
        >
          {props.presets.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.name}
            </option>
          ))}
        </select>
        <button
          className="rounded-md bg-green-600 text-white text-sm font-semibold px-3.5 py-2.5 m-2"
          onClick={createPreset}
        >
          create new preset
        </button>
        <button
          type="button"
          className={
            "rounded-md bg-green-600 text-white text-sm font-semibold px-3.5 py-2.5 h-10 mt-2"
          }
          onClick={addRow}
        >
          Add row
        </button>
      </div>
    </>
  );
};
export default PresetControls;
