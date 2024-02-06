"use client";
import InputDialog from "@/components/InputDialog";
import TabFolders from "@/components/TabFolders";
import BundleEditWidget from "@/components/bundle/BundleEditWidget";
import OutputList from "@/components/outputs/Outputlist";
import BundleInfo from "@/info_blocks/BundleInfo";
import { Bundle } from "@/model/Bundle";
import { Category } from "@/model/Category";
import { Output } from "@/model/Output";
import { BundleSettingsHander } from "@/utils/BundleSettingsHandler";
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";

const OutputMenu = () => {
  const [editBundle, setEditBundle] = useState<Bundle | undefined>(undefined); // [1
  const [editMode, setEditMode] = useState<boolean>(false);
  const [categories, setCategories] = useState<Map<string, Category>>(
    new Map<string, Category>(),
  );
  const [selectedOutputs, setSelectedOutputs] = useState<Output[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedBundle, setSelectedBundle] = useState<Bundle | undefined>();

  const bundleSettingsHandler = new BundleSettingsHander();
  useEffect(() => {
    getCategories().then((categories) => {
      let categoryMap = new Map<string, Category>();
      for (let category of categories) {
        categoryMap.set(category.name, category);
      }
      setCategories(categoryMap);
    });
    getBundles().then((bundles) => {
      setBundles(bundles);
    });
  }, []);

  function toggleOutput(output: Output, categoryName: string) {
    let newSelectedOutputs = [...selectedOutputs]; // copy the array
    if (newSelectedOutputs.includes(output)) {
      newSelectedOutputs = newSelectedOutputs.filter(
        (output) => output !== output,
      );
    } else {
      newSelectedOutputs.push(output);
    }
    let categoryChanged = categories.get(categoryName);
    categoryChanged!.outputs.find(
      (output) =>
        output.output_name.toLowerCase() === output.output_name.toLowerCase(),
    )!.selected = !output.selected;
    setCategories(new Map(categories.set(categoryName, categoryChanged!)));
    setSelectedOutputs(newSelectedOutputs);
  }

  async function setEditState(bundle: Bundle) {
    setEditMode(true);
    setEditBundle(bundle);
  }

  async function getCategories() {
    return invoke("get_outputs").then((r) => {
      return r as Category[];
    });
  }

  async function getBundles() {
    return (await bundleSettingsHandler.getBundleSettings()) as Bundle[];
  }

  function dialogResult(input: string | undefined) {
    if (input !== undefined) {
      const bundle: Bundle = {
        name: input,
        version: 1,
        outputs: [],
      };
      bundleSettingsHandler.addBundleSettings(bundle);
      setBundles([...bundles, bundle]);
    }
    setDialogOpen(false);
  }

  return (
    <>
      {dialogOpen && (
        <InputDialog
          message="Enter a descriptive bundle name"
          placeholder="Bundle Name"
          InfoWindow={<BundleInfo />}
          onConfirm={dialogResult}
        />
      )}
      <div
        className="flex flex-row relative z-0"
        tabIndex={dialogOpen ? -1 : 1}
      >
        <BundleEditWidget
          bundles={bundles}
          tabIndex={dialogOpen ? -1 : 1}
          setDialogOpen={setDialogOpen}
          setSelectedBundle={setSelectedBundle}
          setEditBundle={setEditState}
        />
        <div className="w-[800px] relative">
          {!editMode && selectedBundle && (
            <OutputList bundle={selectedBundle} />
          )}
          {editMode && (
            <h2 className="text-white text-4xl font-bold pl-2">
              editing: {bundles.length > 0 && bundles[0].name}
            </h2>
          )}
          {editMode && categories.size > 0 && (
            <TabFolders
              bundle={editBundle}
              categories={categories}
              toggleOutput={toggleOutput}
              dialogOpen={dialogOpen}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default OutputMenu;
