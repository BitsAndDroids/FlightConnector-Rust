import { WASMEvent } from "@/model/WASMEvent";
import { Button } from "../elements/Button";
import { Input } from "../elements/inputs/Input";
import { Select } from "../elements/Select";
import { useState } from "react";
import InfoWindow from "../InfoWindow";
import { CustomEventHandler } from "@/utils/CustomEventHandler";
import { EventErrors } from "@/app/options/outputs/custom/CustomEvents";

interface EventEditorProps {
  event?: WASMEvent;
  onSave: (event: WASMEvent) => void;
  onCancel?: () => void;
  eventErrors: EventErrors;
  setEventErrors: (errors: EventErrors) => void;
}

export const EventEditor = ({
  event,
  onSave,
  onCancel,
  eventErrors,
  setEventErrors,
}: EventEditorProps) => {
  const customEventHandler = new CustomEventHandler();
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
      output_format: "float",
      update_every: 0.0,
      min: 0.0,
      max: 0.0,
      value: 0,
      offset: 0.0,
      plane_or_category: "generic",
    },
  );
  const [originalEvent, setOriginalEvent] = useState<WASMEvent | undefined>(
    event,
  );

  const validateID = async (value: string) => {
    let errorMessage: string = "";
    let errorState = false;
    if (
      parseInt(value) != originalEvent?.id &&
      (await customEventHandler.getEvent(value))
    ) {
      errorMessage += "This ID is already used";
      errorState = true;
    }
    if (parseInt(value) < 3000) {
      if (errorMessage.length > 0) {
        errorMessage += ", ";
      }
      errorMessage += "The ID has to be > 3000";
      errorState = true;
    }
    if (!errorState) {
      errorState = false;
      errorMessage = "";
    }

    setEventErrors({
      ...eventErrors,
      id: { state: errorState, message: errorMessage },
    });
  };

  const changeUpdateEvery = (value: string) => {
    setNewEvent({ ...newEvent, update_every: parseFloat(value) });
  };

  const changePlaneOrCategory = (value: string) => {
    setNewEvent({ ...newEvent, plane_or_category: value });
  };

  const changeID = async (value: string) => {
    validateID(value);
    setNewEvent({ ...newEvent, id: parseInt(value) });
  };

  const changeAction = (value: string) => {
    if (value.length > 0) {
      setEventErrors({
        ...eventErrors,
        action: { state: false, message: "" },
      });
    }
    setNewEvent({ ...newEvent, action: value });
  };

  const changeOutputFormat = (value: string) => {
    setNewEvent({ ...newEvent, output_format: value });
  };

  const changeActionText = (value: string) => {
    if (value.length > 0) {
      setEventErrors({
        ...eventErrors,
        action_text: { state: false, message: "" },
      });
    }
    setNewEvent({ ...newEvent, action_text: value });
  };

  const changeType = (value: string) => {
    setNewEvent({ ...newEvent, action_type: value });
  };

  return (
    <div className="w-[100%] h-[100%] min-h-[100%] min-w-[100%] -translate-y-1/2 -translate-x-1/2 fixed top-1/2 left-1/2 bg-opacity-50 z-50 flex flew-row align-middle justify-center items-center backdrop-blur-sm drop-shadow-lg">
      <div className="bg-white p-8 rounded-md w-[50%]">
        <div>
          <Input
            label="ID"
            type="number"
            value={newEvent?.id.toString()}
            onChange={changeID as (value: string | boolean) => void}
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
            value={newEvent?.action}
            onChange={changeAction as (value: string | boolean) => void}
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
            onChange={changeActionText as (value: string | boolean) => void}
            errorState={eventErrors.action_text}
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
            onChange={changeType}
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
                onChange={changeOutputFormat}
              />
              <Input
                label="Update every change of"
                value={newEvent.update_every.toString()}
                onChange={
                  changeUpdateEvery as (value: string | boolean) => void
                }
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
