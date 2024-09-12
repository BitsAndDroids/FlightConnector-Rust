import { Button } from "@/components/elements/Button";
import { Input } from "@/components/elements/inputs/Input";
import { Select } from "@/components/elements/Select";
import { WASMEvent } from "@/model/WASMEvent";
import { stringifyCategories } from "../utils/stringifyCategories";

interface WasmEventRowEditorProps {
  wasmEvent: WASMEvent;
  toggleOpen: () => void;
}

export const WasmEventRowEditor = ({
  wasmEvent,
  toggleOpen,
}: WasmEventRowEditorProps) => {
  return (
    <div className="">
      <Input
        value={wasmEvent.action_text}
        label="Checkbox text"
        onLight={true}
      />
      <Input value={wasmEvent.action} label="Action" onLight={true} />
      <Input
        value={stringifyCategories(wasmEvent.plane_or_category)}
        label="Categories (separated by comma)"
        onLight={true}
      />
      <Input
        value={wasmEvent.output_format}
        label="Output format"
        onLight={true}
      />
      <Input
        value={wasmEvent.update_every.toString()}
        type="number"
        label="Update every"
        onLight={true}
      />
      <Select
        value={wasmEvent.action_type}
        label="Action type"
        onLight={true}
        options={["input", "output"]}
        values={["input", "output"]}
      />
      <div className="flex flex-row">
        <Button
          text="Save"
          onClick={() => {
            toggleOpen();
          }}
          style="primary"
        />
      </div>
    </div>
  );
};
