interface BundleEditControlsProps {
  saveBundle: () => void;
}

const BundleEditControls = ({ saveBundle }: BundleEditControlsProps) => {
  return (
    <div
      data-testid="btn-save-bundle"
      className="bg-white mt-1 rounded-md p-1"
      onClick={() => saveBundle()}
    >
      <img src={"/save.svg"} alt="edit" className="h-[22px]" />
    </div>
  );
};
export default BundleEditControls;
