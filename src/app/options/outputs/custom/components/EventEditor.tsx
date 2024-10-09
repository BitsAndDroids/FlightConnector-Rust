import { Button } from "@/components/elements/Button";
import { Input } from "@/components/elements/inputs/Input";
import { Select } from "@/components/elements/Select";
import InfoWindow from "@/components/InfoWindow";
import { WASMEvent } from "@/model/WASMEvent";
import { useState } from "react";
import { EventErrors } from "../CustomEvents";
import {
  parseCategories,
  stringifyCategories,
} from "../utils/CategoriesStringUtils";
import { OutputFormats } from "@/model/Output";
import {
  validateEventDescription,
  validateEventID,
} from "../utils/EventValidator";
interface EventEditorProps {
  onSave: (event: WASMEvent) => void;
  onCancel: () => void;
  events: Array<WASMEvent>;
}

const getValidID = (events: Array<WASMEvent>): number => {
  const ids = new Set();
  for (const event of events) {
    ids.add(event.id);
  }
  let id = 3000;
  while (ids.has(id)) {
    id++;
  }
  return id;
};

export const EventEditor = ({ onSave, onCancel, events }: EventEditorProps) => {
  const [eventErrors, setEventErrors] = useState<EventErrors>({
    id: { state: false, message: "" },
    action: { state: false, message: "" },
    action_text: { state: false, message: "" },
  });
  const [newEvent, setNewEvent] = useState<WASMEvent>({
    id: getValidID(events),
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
    made_by: "User",
  });

  const onChangeField = async (field: string, value: string | boolean) => {
    if (typeof value !== "string") {
      return;
    }
    if (field === "plane_or_category") {
      const parsedValue = parseCategories(value as string);
      setNewEvent({ ...newEvent, plane_or_category: parsedValue });
      return;
    }
    if (field === "id") {
      const idState = await validateEventID(value);
      setEventErrors({
        ...eventErrors,
        ...idState,
      });
    }
    if (field === "action_text") {
      const actionTextState = validateEventDescription(value);
      setEventErrors({
        ...eventErrors,
        ...actionTextState,
      });
    }
    setNewEvent({ ...newEvent, [field]: value });
  };

  const saveEvent = (event: WASMEvent) => {
    //itterate over the eventErrors and check if there is any error
    if (
      eventErrors.id.state ||
      eventErrors.action.state ||
      eventErrors.action_text.state
    ) {
      return;
    }
    onSave(event);
  };

  return (
    <div className="w-[100%] h-[100%] min-h-[100%] min-w-[100%] -translate-y-1/2 -translate-x-1/2 fixed top-1/2 left-1/2 bg-opacity-50 z-50 flex flew-row align-middle justify-center items-center backdrop-blur-sm drop-shadow-lg">
      <div className="bg-white p-8 rounded-md w-[50%]">
        <div>
          <Input
            label="ID"
            type="number"
            value={newEvent?.id.toString()}
            onChange={(value) => onChangeField("id", value)}
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
            onChange={(value) => onChangeField("action", value)}
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
            onChange={(value) => onChangeField("action_text", value)}
            errorState={eventErrors.action_text}
            onLight={true}
            infoWindow={
              <InfoWindow
                docs_url="https://bitsanddroids.github.io/FlightConnector-Rust/ch06-01-custom-events.html#description"
                message="Description of the action. This text is also used as label for the checkboxes in the bundle menu for outputs."
              />
            }
          />
          <div className="flex flex-row">
            <Select
              label="Type"
              value={newEvent?.action_type}
              options={[{ value: "input" }, { value: "output" }]}
              onChange={(value) => onChangeField("action_type", value)}
              size="md"
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
                  options={OutputFormats}
                  value={newEvent?.output_format}
                  onChange={(value) => onChangeField("output_format", value)}
                  onLight={true}
                  infoWindow={
                    <InfoWindow
                      docs_url="https://bitsanddroids.github.io/FlightConnector-Rust/ch06-01-custom-events.html#output-format"
                      message="The format of the output data send to your controller. Integer: 1, Float: 1.0, Boolean: true/false, String: 'string', Time: seconds after midnight."
                    />
                  }
                />
                <Input
                  label="Update every change of"
                  value={newEvent.update_every.toString()}
                  onChange={(value: string | boolean) =>
                    onChangeField("update_every", value)
                  }
                  type="number"
                  decimals={true}
                  onLight={true}
                  infoWindow={
                    <InfoWindow
                      docs_url="https://bitsanddroids.github.io/FlightConnector-Rust/ch06-01-custom-events.html#update-every"
                      message="The rate at which the output is updated. This event will be triggered every change of this value. If the value is 0, the event will be triggered every change (even the smallest change 0.001). If the value is 10, the event will be triggered every change of 10. i.e. 10 feet, 20 feet, 30 feet..."
                    />
                  }
                />
              </>
            )}
          </div>
          <Input
            label="Plane or category (seperated by comma)"
            value={stringifyCategories(newEvent?.plane_or_category)}
            onChange={(value: string | boolean) =>
              onChangeField("plane_or_category", value)
            }
            onLight={true}
          />
        </div>
        <div className="flex flex-row justify-center items-center">
          <Button
            onClick={() => saveEvent(newEvent)}
            text="Save"
            style="primary"
          />
          <Button onClick={() => onCancel()} text="Cancel" style="danger" />
        </div>
      </div>
    </div>
  );
};
