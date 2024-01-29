'use client';
import { Bundle } from "@/model/Bundle";


interface BundleEditWidgetProps {
  bundles: Bundle[];
  setDialogOpen: (open: boolean) => void;
}
const BundleEditWidget = ({ bundles, setDialogOpen }: BundleEditWidgetProps) => {
  return (
    <div className="flex flex-row mt-12">
      <div className="flex flex-col h-60 w-60 bg-gray-800 rounded-md mr-2 p-4">
        <div className="flex flex-row">
          <h2 className="text-white my-2 font-bold text-xl">Available sets</h2>
          <button className="bg-gray-700 rounded-3xl p-1 px-4 mx-2 text-white" onClick={() => setDialogOpen(true)}>+</button>
        </div>
        {bundles.length > 0 && bundles.map((bundle) => {
          return (
            <div className="flex flex-row items-center justify-between" key={bundle?.name}>
              <p className="text-white">{bundle?.name}</p>
              <button className="bg-gray-700 rounded-md p-2 text-white">Edit</button>
            </div>
          )
        }
        )}
      </div>
    </div >
  );
}

export default BundleEditWidget;
