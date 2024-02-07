import Image from "next/image";
import saveIcon from "../../../public/save.svg";
interface BundleEditControlsProps {
  saveBundle: () => void;
}

const BundleEditControls = ({ saveBundle }: BundleEditControlsProps) => {
  return (
    <div className="bg-white mt-1 rounded-md p-1" onClick={() => saveBundle()}>
      <Image src={saveIcon} alt="edit" height={20} width={20} />
    </div>
  );
};
export default BundleEditControls;
