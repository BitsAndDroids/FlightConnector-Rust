import { Preset } from "@/model/Preset";
import { PresetSettingsHandler } from "@/utils/PresetSettingsHandler";
import { useEffect, useState } from "react";
import { Header } from "../elements/header";
import { PresetList } from "./PresetList";

interface PresetManagerProps {}

export const PresetManager = (props: PresetManagerProps) => {
  const presetSettingsHandler = new PresetSettingsHandler();
  const [presets, setPresets] = useState<Preset[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);
  useEffect(() => {
    const fetchPresets = async () => {
      const presets = await presetSettingsHandler.getAllPresets();
      setPresets(presets);
    };

    fetchPresets();
  }, []);

  const deletePreset = async (preset: Preset) => {
    if (preset.name === "Default") {
      return;
    }
    presetSettingsHandler.deletePreset(preset.id);
    setPresets(presets.filter((p) => p.id !== preset.id));
  };

  return (
    <div className="flex flex-col">
      <Header level={1} title="Presets" />
      <div className="flex flex-row mt-4">
        <PresetList
          presets={presets}
          viewPreset={setSelectedPreset}
          deletePreset={deletePreset}
        />
        {selectedPreset && (
          <div className="ml-4 bg-white rounded-md p-4 w-[400px]">
            <Header level={2} title={selectedPreset?.name} />
          </div>
        )}
      </div>
    </div>
  );
};
