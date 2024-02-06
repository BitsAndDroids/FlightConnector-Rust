"use client";
import BundleInfo from "@/info_blocks/BundleInfo";
import { Bundle } from "@/model/Bundle";
import BundleRow from "./BundleRow";

interface BundleEditWidgetProps {
  bundles: Bundle[];
  tabIndex: number;
  setDialogOpen: (open: boolean) => void;
  setSelectedBundle: (bundle: Bundle) => void;
  setEditBundle: (bundle: Bundle) => void;
}
const BundleEditWidget = ({
  bundles,
  tabIndex,
  setDialogOpen,
  setSelectedBundle,
  setEditBundle,
}: BundleEditWidgetProps) => {
  return (
    <div className="flex flex-row mt-12 z-50 relative">
      <div className="flex flex-col h-fit w-80 bg-white rounded-md mr-2 p-4 relative">
        <div className="flex flex-row mb-4">
          <h2 className="my-2 font-bold text-xl">Available bundles</h2>
          <div className="mt-2">
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
              />
            );
          })}
      </div>
    </div>
  );
};

export default BundleEditWidget;
