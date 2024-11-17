import { Bundle } from "@/model/Bundle";
import { Row } from "../../../components/elements/Row";

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
    <Row
      id={bundle.name}
      name={bundle.name}
      object={bundle}
      onDelete={deleteBundle}
      onEdit={setEditBundle}
      onClick={setSelectedBundle}
    />
  );
};

export default BundleRow;
