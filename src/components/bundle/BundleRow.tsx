import Image from "next/image";
import trashcan from "/public/trashcan.svg";
import edit from "/public/edit.svg";
import { Bundle } from "@/model/Bundle";

interface BundleRowProps {
  bundle: Bundle;
}

const BundleRow = ({ bundle }: BundleRowProps) => {
  return (
    <div className="flex flex-row items-center justify-between mb-2 bg-white rounded-md p-1 px-3 drop-shadow" key={bundle?.name}>
      <p className="">{bundle?.name}</p>
      <div className="flex flex-row justify-between w-12">
        <Image src={trashcan} alt="info" height={16} onClick={() => { console.log("trash") }} className="cursor-pointer" />
        <Image src={edit} alt="info" height={16} onClick={() => { console.log("edit") }} className="cursor-pointer" />
      </div>
    </div>
  )
};

export default BundleRow;
