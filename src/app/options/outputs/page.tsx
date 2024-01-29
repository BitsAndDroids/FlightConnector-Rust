'use client';
import InfoWindow from "@/components/InfoWindow";
import InputDialog from "@/components/InputDialog";
import TabFolders from "@/components/TabFolders";
import BundleEditWidget from "@/components/bundle/BundleEditWidget";
import BundleInfo from "@/info_blocks/BundleInfo";
import { Bundle } from "@/model/Bundle";
import { Category } from "@/model/Category";
import { Output } from "@/model/Output";
import { BundleSettingsHander } from "@/utils/BundleSettingsHandler";
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";

const OutputMenu = () => {
  const [categories, setCategories] = useState<Map<string, Category>>(new Map<string, Category>());
  const [selectedOutputs, setSelectedOutputs] = useState<string[]>([]);
  const defaultBundle: Bundle = { name: "Placeholder", version: 1, outputs: [] };
  const [bundles, setBundles] = useState<Bundle[]>([])
  const [dialogOpen, setDialogOpen] = useState<boolean>(true);

  const bundleSettingsHandler = new BundleSettingsHander();
  useEffect(() => {
    getCategories().then((categories) => {
      let categoryMap = new Map<string, Category>();
      for (let category of categories) {
        categoryMap.set(category.name, category);
      }
      setCategories(categoryMap)
    });
    getBundles().then((bundles) => {
      setBundles(bundles);
    }
    )
  }, []);

  function toggleOutput(output: Output, categoryName: string) {
    let outputName = output.output_name.toLowerCase();
    let newSelectedOutputs = [...selectedOutputs]; // copy the array
    if (newSelectedOutputs.includes(outputName)) {
      newSelectedOutputs = newSelectedOutputs.filter((output) => output !== outputName);
    } else {
      newSelectedOutputs.push(outputName);
    }
    let categoryChanged = categories.get(categoryName);
    categoryChanged!.outputs.find((output) => output.output_name.toLowerCase() === outputName)!.selected = !output.selected;
    setCategories(new Map(categories.set(categoryName, categoryChanged!)));
    setSelectedOutputs(newSelectedOutputs);
  }

  async function getCategories() {
    return invoke("get_outputs").then((r) => {
      return r as Category[];
    }
    )
  }

  async function getBundles() {
    return await bundleSettingsHandler.getBundleSettings() as Bundle[];
  }

  function dialogResult(input: string | undefined) {
    if (input !== undefined) {
      bundleSettingsHandler.addBundleSettings({ name: input, version: 1, outputs: [] });
    }
    setDialogOpen(false);
  }

  return (<>
    {dialogOpen && <InputDialog message="Enter a descriptive bundle name" placeholder="Bundle Name" InfoWindow={<BundleInfo />} onConfirm={dialogResult} />}j
    <div className="flex flex-row">
      <button className="bg-gray-800 rounded-md p-2 m-2 text-white" onClick={() => {
        setDialogOpen(true);
        console.log(dialogOpen);
      }}>Add Bundle</button>
      <BundleEditWidget bundles={bundles} setDialogOpen={setDialogOpen} />
      <div className="w-[800px]">
        <h2 className="text-white text-4xl font-bold pl-2">editing: {bundles.length > 0 && bundles[0].name}</h2>
        {categories.size > 0 &&
          <TabFolders categories={categories} toggleOutput={toggleOutput} />
        }
      </div>
    </div>
  </>
  )
}

export default OutputMenu;
