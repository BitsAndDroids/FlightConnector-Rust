import { Button } from "@/components/elements/Button";
import { Header } from "@/components/elements/header";
import { Input } from "@/components/elements/inputs/Input";
import { Select } from "@/components/elements/Select";
import InfoWindow from "@/components/InfoWindow";
import { WASMEvent } from "@/model/WASMEvent";
import { useState } from "react";
import { EventErrors } from "../CustomEvents";
interface EventEditorProps {
  onSave: (event: WASMEvent) => void;
  onCancel: () => void;
}
export const EventEditor = ({ onSave, onCancel }: EventEditorProps) => {
  const [eventErrors, setEventErrors] = useState<EventErrors>({
    id: { state: false, message: "" },
    action: { state: false, message: "" },
    action_text: { state: false, message: "" },
  });
  const [newEvent, setNewEvent] = useState<WASMEvent>({
    id: 0,
    action: "",
    action_text: "",
    action_type: "input",
    output_format: "",
    update_every: 0,
    min: 0,
    max: 0,
    value: 0,
    offset: 0,
    plane_or_category: [""],
  });

  const onChangeField = (field: string, value: string | boolean) => {};
  return (
    <div className="w-[100%] h-[100%] min-h-[100%] min-w-[100%] -translate-y-1/2 -translate-x-1/2 fixed top-1/2 left-1/2 bg-opacity-50 z-50 flex flew-row align-middle justify-center items-center backdrop-blur-sm drop-shadow-lg">
      <div className="bg-white p-8 rounded-md w-[50%]">
        <div>
          <Input
            label="ID"
            type="number"
            value={newEvent?.id.toString()}
            onChange={onChangeField as (value: string | boolean) => void}
            onLight={true}
            errorState={eventErrors.id}
            infoWindow={
              <InfoWindow
                docs_url="https://bitsanddroids.github.io/FlightConnector-Rust/ch06-01-custom-events.html#id"
                message="Unique ID for the event. For inputs: If you send this id to the connector the action will be triggered. For outputs: The connector will prefix the data with this id."
              />
            }
          />
          <Input
            label="Action"
            type="textarea"
            onLight={true}
            value={newEvent?.action}
            onChange={onChangeField as (value: string | boolean) => void}
            errorState={eventErrors.action}
            infoWindow={
              <InfoWindow
                docs_url="https://bitsanddroids.github.io/FlightConnector-Rust/ch06-01-custom-events.html#action"
                message="Action to be performed"
              />
            }
          />
          <Input
            label="Description"
            value={newEvent?.action_text}
            onChange={onChangeField as (value: string | boolean) => void}
            errorState={eventErrors.action_text}
            onLight={true}
            infoWindow={
              <InfoWindow
                docs_url="https://bitsanddroids.github.io/FlightConnector-Rust/ch06-01-custom-events.html#description"
                message="Description of the action. This text is also used as label for the checkboxes in the bundle menu for outputs."
              />
            }
          />
          <Select
            label="Type"
            value={newEvent?.action_type}
            options={["input", "output"]}
            values={["input", "output"]}
            onChange={onChangeField as (value: string | boolean) => void}
            onLight={true}
            infoWindow={
              <InfoWindow
                docs_url="https://bitsanddroids.github.io/FlightConnector-Rust/ch06-01-custom-events.html#type"
                message="Type of the event. An Input lets you send data from your controller to MFS. An Output is data that gets send from MFS to your controller."
              />
            }
          />
          {newEvent.action_type === "output" && (
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
                onChange={onChangeField as (value: string | boolean) => void}
                onLight={true}
              />
              <Input
                label="Update every change of"
                value={newEvent.update_every.toString()}
                onChange={onChangeField as (value: string | boolean) => void}
                type="number"
                decimals={true}
                onLight={true}
              />
            </>
          )}
          {/* <Select */}
          {/*   label="Plane or category" */}
          {/*   options={categories} */}
          {/*   values={categories} */}
          {/*   value={newEvent?.plane_or_category} */}
          {/*   onChange={changePlaneOrCategory} */}
          {/* /> */}
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
