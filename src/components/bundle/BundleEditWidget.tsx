"use client";
import BundleInfo from "@/info_blocks/BundleInfo";
import { Bundle } from "@/model/Bundle";
import BundleRow from "./BundleRow";
import { Header } from "../elements/header";

interface BundleEditWidgetProps {
  bundles: Bundle[];
  tabIndex: number;
  setDialogOpen: (open: boolean) => void;
  setSelectedBundle: (bundle: Bundle) => void;
  setEditBundle: (bundle: Bundle) => void;
  deleteBundle: (bundle: Bundle) => void;
}
const BundleEditWidget = ({
  bundles,
  tabIndex,
  setDialogOpen,
  setSelectedBundle,
  setEditBundle,
  deleteBundle,
}: BundleEditWidgetProps) => {
  return (
    <div className="flex flex-row mt-14 z-50 relative">
      <div className="flex flex-col h-fit w-80 bg-gradient-to-b from-[#305d7b] to-[#596d96] rounded-md mr-2 p-4 relative">
        <div className="flex flex-row mb-4">
          <Header level={2} onLight={false} title="Available bundles" />
          <div className="mt-4 ml-1">
            <BundleInfo />
          </div>
          <button
            className="bg-green-600 rounded-3xl h-8 w-8 text-white mt-[8px] ml-14"
            onClick={() => setDialogOpen(true)}
            tabIndex={tabIndex}
          >
            +
          </button>
        </div>
        {bundles.length > 0 &&
          bundles.map((bundle) => {
            return (
              <BundleRow
                bundle={bundle}
                key={bundle.name}
                setSelectedBundle={setSelectedBundle}
                setEditBundle={setEditBundle}
                deleteBundle={deleteBundle}
              />
            );
          })}
      </div>
    </div>
  );
};

export default BundleEditWidget;
