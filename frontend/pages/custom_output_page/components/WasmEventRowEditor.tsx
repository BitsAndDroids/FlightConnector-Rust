import { Button } from "@/components/elements/Button";
import { Input } from "@/components/elements/inputs/Input";
import { Select } from "@/components/elements/Select";
import { WASMEvent } from "@/model/WASMEvent";
import {
  parseCategories,
  stringifyCategories,
} from "../utils/CategoriesStringUtils";
import { useState } from "react";
import { OutputFormats } from "@/model/Output";
import InfoWindow from "@/components/InfoWindow";
import { validateEventID } from "../utils/EventValidator";
import { EventErrors } from "../CustomEvents";

interface WasmEventRowEditorProps {
  originalEvent: WASMEvent;
  onEventChanged: (event: WASMEvent, oldEventId: number) => void;
  onEventDeleted: (id: number) => void;
  toggleOpen: () => void;
}

export const WasmEventRowEditor = ({
  originalEvent,
  onEventChanged,
  onEventDeleted,
  toggleOpen,
}: WasmEventRowEditorProps) => {
  const [wasmEvent, setWasmEvent] = useState<WASMEvent>(originalEvent);
  const [eventErrors, setEventErrors] = useState<EventErrors>({
    id: { state: false, message: "" },
    action: { state: false, message: "" },
    action_text: { state: false, message: "" },
  });
  const changeEvent = async (key: string, value: string) => {
    if (key === "plane_or_category") {
      if (value.endsWith(",")) {
      }
      const parsedValue = parseCategories(value);
      setWasmEvent({ ...wasmEvent, plane_or_category: parsedValue });
      return;
    }
    if (key === "update_every") {
      setWasmEvent({ ...wasmEvent, update_every: parseFloat(value) });
      return;
    }
    if (key === "id") {
      if (value !== originalEvent.id.toString()) {
        const idState = await validateEventID(value);
        setEventErrors({ ...eventErrors, ...idState });
      } else {
        setEventErrors({ ...eventErrors, id: { state: false, message: "" } });
      }

      setWasmEvent({ ...wasmEvent, id: parseInt(value) });
      return;
    }
    setWasmEvent({ ...wasmEvent, [key]: value });
  };

  const onSavePressed = () => {
    onEventChanged(wasmEvent, originalEvent.id);
    toggleOpen();
  };
  return (
    <div className="">
      <Input
        testid="input_id"
        value={wasmEvent.id.toString()}
        label="ID"
        onLight={true}
        errorState={eventErrors.id}
        onChange={(value) => {
          changeEvent("id", value as string);
        }}
        infoWindow={
          <InfoWindow
            docs_url="https://bitsanddroids.github.io/FlightConnector-Rust/ch06-01-custom-events.html#id"
            message="Unique ID for the event. For inputs: If you send this id to the connector the action will be triggered. For outputs: The connector will prefix the data with this id."
            openLeft={true}
          />
        }
      />
      <Input
        testid="input_action_text"
        value={wasmEvent.action_text}
        label="Checkbox text"
        onLight={true}
        onChange={(value) => {
          changeEvent("action_text", value as string);
        }}
        infoWindow={
          <InfoWindow
            docs_url="https://bitsanddroids.github.io/FlightConnector-Rust/ch06-01-custom-events.html#description"
            message="Description of the action. This text is also used as label for the checkboxes in the bundle menu for outputs."
            openLeft={true}
          />
        }
      />
      <Input
        testid="input_action"
        value={wasmEvent.action}
        label="Action"
        onLight={true}
        onChange={(value) => {
          changeEvent("action", value as string);
        }}
        infoWindow={
          <InfoWindow
            docs_url="https://bitsanddroids.github.io/FlightConnector-Rust/ch06-01-custom-events.html#action"
            message="Action to be performed"
            openLeft={true}
          />
        }
      />
      <div className="flex flex-row">
        <Select
          testid="select_action_type"
          value={wasmEvent.action_type}
          label="Action type"
          onLight={true}
          options={[{ value: "input" }, { value: "output" }]}
          size="md"
          onChange={(value) => {
            changeEvent("action_type", value as string);
          }}
          infoWindow={
            <InfoWindow
              docs_url="https://bitsanddroids.github.io/FlightConnector-Rust/ch06-01-custom-events.html#type"
              message="Type of the event. An Input lets you send data from your controller to MFS. An Output is data that gets send from MFS to your controller."
            />
          }
        />

        {wasmEvent.action_type === "output" && (
          <>
            <Select
              testid="select_output_format"
              options={OutputFormats}
              value={wasmEvent.output_format}
              label="Output format"
              onLight={true}
              onChange={(value) => {
                changeEvent("output_format", value as string);
              }}
              infoWindow={
                <InfoWindow
                  docs_url="https://bitsanddroids.github.io/FlightConnector-Rust/ch06-01-custom-events.html#type"
                  message="Type of the event. An Input lets you send data from your controller to MFS. An Output is data that gets send from MFS to your controller."
                />
              }
            />
            <Input
              value={wasmEvent.update_every.toString()}
              type="number"
              label="Update every"
              size="sm"
              onLight={true}
              onChange={(value) => {
                changeEvent("update_every", value as string);
              }}
              infoWindow={
                <InfoWindow
                  docs_url="https://bitsanddroids.github.io/FlightConnector-Rust/ch06-01-custom-events.html#update-every"
                  message="If the value is 0, the event will be send every change (even the smallest change 0.001). If the value is 10, the event will be triggered every change of 10. i.e. 10 feet, 20 feet, 30 feet..."
                  openLeft={true}
                />
              }
            />
          </>
        )}
      </div>
      <Input
        value={stringifyCategories(wasmEvent.plane_or_category)}
        label="Categories (separated by comma)"
        onLight={true}
        onChange={(value) => {
          changeEvent("plane_or_category", value as string);
        }}
      />

      <div className="flex flex-row">
        <Button
          text="Save"
          onClick={onSavePressed}
          style="primary"
          testid="btn_save_wasm"
        />
        <div
          className="mt-1"
          onClick={() => {
            onEventDeleted(originalEvent.id);
          }}
        >
          <img
            src={"/trashcan.svg"}
            alt="trashcan"
            className="h-[30px]"
            height={30}
            width={30}
          />
        </div>
      </div>
    </div>
  );
};
