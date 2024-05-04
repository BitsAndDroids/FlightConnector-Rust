import { WASMEvent } from "@/model/WASMEvent";
import { Button } from "../elements/Button";
import { Input } from "../elements/Input";
import { Select } from "../elements/Select";
import { useState } from "react";

interface EventEditorProps {
  event?: WASMEvent;
  onSave?: (event: WASMEvent) => void;
  onCancel?: () => void;
}

export const EventEditor = ({ event, onSave, onCancel }: EventEditorProps) => {
  const [type, setType] = useState<string>(event?.action_type || "input");
  return (
    <div className="w-[100%] h-[100%] min-h-[100%] min-w-[100%] -translate-y-1/2 -translate-x-1/2 fixed top-1/2 left-1/2 bg-opacity-50 z-50 flex flew-row align-middle justify-center items-center backdrop-blur-sm drop-shadow-lg">
      <div className="bg-white p-8 rounded-md w-[50%]">
        <div>
          <Input
            label="ID"
            type="number"
            value={event?.id.toString()}
            onChange={() => {}}
          />
          <Input
            label="Action"
            type="textarea"
            value={event?.action}
            onChange={() => {}}
          />
          <Select
            label="Type"
            value={event?.action_type}
            options={["input", "output"]}
            onChange={setType}
          />
        </div>
        <div className="flex flex-row justify-center items-center">
          <Button onClick={() => {}} text="Save" style="primary" />
          <Button
            onClick={onCancel || (() => {})}
            text="Cancel"
            style="danger"
          />
        </div>
      </div>
    </div>
  );
};
