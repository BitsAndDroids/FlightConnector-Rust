import { Preset } from "@/model/Preset";
import { Row } from "../elements/Row";

interface PresetListProps {
  presets: Preset[];
  viewPreset: (preset: Preset) => void;
  deletePreset: (preset: Preset) => void;
}

export const PresetList = (props: PresetListProps) => {
  const onEdit = (toEdit: any) => {
    console.log(toEdit);
  };

  return (
    <div className="bg-white rounded-md p-4 w-80">
      {props.presets.map((preset) => (
        <div key={preset.id}>
          <Row
            id={preset.id}
            name={preset.name}
            object={preset}
            onClick={props.viewPreset}
            onDelete={props.deletePreset}
            setDelete={preset.name !== "default"}
            onEdit={onEdit}
          />
        </div>
      ))}
    </div>
  );
};
