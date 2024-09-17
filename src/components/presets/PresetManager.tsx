import { Preset } from "@/model/Preset";
import { PresetSettingsHandler } from "@/utils/PresetSettingsHandler";
import { useEffect, useRef, useState } from "react";
import { Header } from "../elements/header";
import { PresetList } from "./PresetList";
import { Table } from "../elements/Table";

interface PresetManagerProps {}

export const PresetManager = (props: PresetManagerProps) => {
  const presetSettingsHandler = useRef(new PresetSettingsHandler());
  const [presets, setPresets] = useState<Preset[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);
  useEffect(() => {
    const fetchPresets = async () => {
      const presets = await presetSettingsHandler.current.getAllPresets();
      setPresets(presets);
    };

    fetchPresets();
  }, []);

  const deletePreset = async (preset: Preset) => {
    if (preset.name === "Default") {
      return;
    }
    presetSettingsHandler.current.deletePreset(preset.id);
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
            <div className="-mx-4 mt-4 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg">
              <Table
                headers={["com_port", "bundle_name"]}
                elements={selectedPreset.runBundles}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
