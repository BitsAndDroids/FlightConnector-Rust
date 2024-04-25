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
            <div className="-mx-4 mt-4 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th className="font-semibold text-gray-800 py-3.5 pl-6 pr-3 text-left">
                      com_ports
                    </th>
                    <th className="text-start font-semibold text-gray-800 py-3.5 pl-4">
                      bundles
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPreset?.runBundles.map((bundle) => (
                    <tr key={bundle.id}>
                      <td className="py-4 pl-4 pr-3 text-sm sm:pl-6">
                        {bundle.com_port.substring(0, 20)}...
                      </td>
                      <td className="px-4 py-3.5 text-sm lg:table-cell">
                        {bundle.bundle_name || "No bundle"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
