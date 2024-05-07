import { WASMEvent } from "@/model/WASMEvent";
import { Button } from "../elements/Button";
import { Input } from "../elements/Input";
import { Select } from "../elements/Select";
import { useState } from "react";

interface EventEditorProps {
  event?: WASMEvent;
  onSave: (event: WASMEvent) => void;
  onCancel?: () => void;
}

export const EventEditor = ({ event, onSave, onCancel }: EventEditorProps) => {
  const [type, setType] = useState<string>(event?.action_type || "input");
  const [categories, setCategories] = useState<string[]>([
    "general aviation",
    "airliner",
    "generic",
    "turboprop",
  ]);
  const [newEvent, setNewEvent] = useState<WASMEvent>(
    event || {
      id: 0,
      action: "",
      action_type: "input",
      action_text: "",
      output_format: "",
      update_every: 0.0,
      min: 0.0,
      max: 0.0,
      value: 0,
      offset: 0.0,
      plane_or_category: "generic",
    },
  );

  const changeUpdateEvery = (value: string) => {
    setNewEvent({ ...newEvent, update_every: parseFloat(value) });
  };

  const changePlaneOrCategory = (value: string) => {
    setNewEvent({ ...newEvent, plane_or_category: value });
  };

  const changeID = (value: string) => {
    setNewEvent({ ...newEvent, id: parseInt(value) });
  };

  const changeAction = (value: string) => {
    setNewEvent({ ...newEvent, action: value });
  };

  const changeOutputFormat = (value: string) => {
    setNewEvent({ ...newEvent, output_format: value });
  };

  const changeActionText = (value: string) => {
    setNewEvent({ ...newEvent, action_text: value });
  };

  return (
    <div className="w-[100%] h-[100%] min-h-[100%] min-w-[100%] -translate-y-1/2 -translate-x-1/2 fixed top-1/2 left-1/2 bg-opacity-50 z-50 flex flew-row align-middle justify-center items-center backdrop-blur-sm drop-shadow-lg">
      <div className="bg-white p-8 rounded-md w-[50%]">
        <div>
          <Input
            label="ID"
            type="number"
            value={newEvent?.id.toString()}
            onChange={changeID}
          />
          <Input
            label="Action"
            type="textarea"
            value={newEvent?.action}
            onChange={changeAction}
          />
          <Input
            label="Description"
            value={newEvent?.action_text}
            onChange={changeActionText}
          />
          <Select
            label="Type"
            value={newEvent?.action_type}
            options={["input", "output"]}
            values={["input", "output"]}
            onChange={setType}
          />
          {type === "output" && (
            <>
              <Select
                label="Output format"
                options={[
                  "Integer (1)",
                  "Float (1.0)",
                  "Boolean (true, false)",
                  'String ("string")',
                  "Time",
                ]}
                values={[
                  "integer",
                  "float",
                  "boolean",
                  "string",
                  "secondsaftermidnight",
                ]}
                value={newEvent?.output_format}
                onChange={changeOutputFormat}
              />
              <Input
                label="Update every change of"
                value={newEvent.update_every.toString()}
                onChange={changeUpdateEvery}
                type="number"
                decimals={true}
              />
            </>
          )}
          <Select
            label="Plane or category"
            options={categories}
            values={categories}
            value={newEvent?.plane_or_category}
            onChange={changePlaneOrCategory}
          />
        </div>
        <div className="flex flex-row justify-center items-center">
          <Button
            onClick={() => onSave(newEvent)}
            text="Save"
            style="primary"
          />
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
