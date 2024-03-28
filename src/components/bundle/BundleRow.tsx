// import Image from "next/image";
import { Bundle } from "@/model/Bundle";

interface BundleRowProps {
  bundle: Bundle;
  setSelectedBundle: (bundle: Bundle) => void;
  setEditBundle: (bundle: Bundle) => void;
  deleteBundle: (bundle: Bundle) => void;
}

const BundleRow = ({
  bundle,
  setSelectedBundle,
  setEditBundle,
  deleteBundle,
}: BundleRowProps) => {
  return (
    <div
      className="flex flex-row items-center justify-between mb-2 bg-white rounded-md p-1 px-3 drop-shadow"
      key={bundle?.name}
      onClick={() => {
        setSelectedBundle(bundle);
        console.log("set");
      }}
    >
      <p className="">{bundle?.name}</p>
      <div className="flex flex-row justify-between w-12">
        <img
          src={"/trashcan.svg"}
          alt="info"
          onClick={(e) => {
            deleteBundle(bundle);
            e.stopPropagation();
          }}
          className="cursor-pointer h-[16px]"
        />
        <img
          src={"/edit.svg"}
          alt="info"
          onClick={() => {
            setEditBundle(bundle);
          }}
          className="cursor-pointer h-[16px]"
        />
      </div>
    </div>
  );
};

export default BundleRow;
