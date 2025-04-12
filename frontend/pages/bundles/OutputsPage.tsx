import InputDialog from "@/components/InputDialog";
import BundleEditControls from "#pages/bundles/components/BundleEditControls.js";
import BundleEditWidget from "#pages/bundles/components/BundleEditWidget.js";
import OutputList from "@/components/outputs/Outputlist";
import BundleInfo from "@/info_blocks/BundleInfo";
import { Bundle } from "@/model/Bundle";
import { Output } from "@/model/Output";
import { BundleSettingsHandler } from "@/utils/BundleSettingsHandler";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useRef, useState } from "react";
import BundleEditor from "./components/BundleEditor";

async function getOutputs() {
  return invoke("get_outputs").then((r) => {
    return r as Output[];
  });
}

async function getBundles(bundleSettingsHandler: BundleSettingsHandler) {
  return (await bundleSettingsHandler.getBundleSettings()) as Bundle[];
}
const OutputsPage: React.FC = () => {
  const [editBundle, setEditBundle] = useState<Bundle | undefined>(undefined); // [1
  const [editMode, setEditMode] = useState<boolean>(false);
  const [outputs, setOutputs] = useState<Output[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedBundle, setSelectedBundle] = useState<Bundle | undefined>();

  const bundleSettingsHandler = useRef(new BundleSettingsHandler());
  useEffect(() => {
    getOutputs().then((outputs) => {
      setOutputs(outputs);
    });
    getBundles(bundleSettingsHandler.current).then((bundles) => {
      setBundles(bundles);
    });
  }, []);

  function saveBundle() {
    setEditMode(false);
    if (!editBundle) return;
    let updatedBundle = {
      name: editBundle?.name,
      version: editBundle?.version + 1,
      outputs: outputs.filter((output) => output.selected),
    };
    setEditBundle(updatedBundle);
    setBundles(
      bundles.map((bundle) =>
        bundle.name === editBundle.name ? updatedBundle : bundle,
      ),
    );
    setSelectedBundle(updatedBundle);
    bundleSettingsHandler.current.updateBundleSettings(updatedBundle);
  }

  function toggleOutput(output: Output) {
    let outputsToSearch = [...outputs];
    setOutputs(toggleOutputs(output, outputsToSearch));
  }

  function toggleOutputs(output: Output, outputsToSearch: Output[]): Output[] {
    // toggle the selected state of the output
    for (let o of outputsToSearch)
      if (o.id === output.id) {
        o.selected = !o.selected;
      }
    return outputsToSearch;
  }

  function changeUpdateRate(output: Output) {
    setOutputs(outputs.map((o) => (o.id === output.id ? output : o)));
  }

  function dialogResult(input: string | undefined) {
    if (input !== undefined) {
      const bundle: Bundle = {
        name: input,
        version: 1,
        outputs: [],
      };
      bundleSettingsHandler.current.addBundleSettings(bundle);
      setBundles([...bundles, bundle]);
    }
    setDialogOpen(false);
  }

  async function resetOutputs() {
    setOutputs(await getOutputs());
  }

  async function setEditBundleState(editBundle: Bundle) {
    setEditMode(true);
    await resetOutputs();
    let outputState = [...outputs];
    if (!editBundle.outputs) {
      return;
    }
    for (let output of editBundle.outputs) {
      for (let o of outputState) {
        if (o.id === output.id) {
          o.selected = true;
          o.update_every = output.update_every;
        }
      }
    }
    setOutputs(outputState);
    setEditBundle(editBundle);
  }

  function deleteBundle(bundle: Bundle) {
    setBundles(bundles.filter((b) => b.name !== bundle.name));
    if (selectedBundle?.name === bundle.name) setSelectedBundle(undefined);
    bundleSettingsHandler.current.deleteBundleSettings(bundle);
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
        className="flex flex-row relative z-0 mt-2"
        data-testid="outputs_page"
        tabIndex={dialogOpen ? -1 : 1}
      >
        <BundleEditWidget
          bundles={bundles}
          tabIndex={dialogOpen ? -1 : 1}
          setDialogOpen={setDialogOpen}
          setSelectedBundle={setSelectedBundle}
          setEditBundle={setEditBundleState}
          deleteBundle={deleteBundle}
        />
        <div className="w-[800px] relative">
          {!editMode && selectedBundle && (
            <OutputList bundle={selectedBundle} />
          )}
          {editMode && (
            <div className="ml-4 flex flex-row items-center">
              <BundleEditControls saveBundle={saveBundle} />
              <h2 className="text-white text-4xl font-bold pl-2">
                {bundles.length > 0 && selectedBundle?.name}
              </h2>
            </div>
          )}
          {editMode && outputs.length > 0 && (
            <BundleEditor
              outputs={outputs}
              toggleOutput={toggleOutput}
              dialogOpen={dialogOpen}
              changeUpdateRate={changeUpdateRate}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default OutputsPage;
