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

interface WasmEventRowEditorProps {
  originalEvent: WASMEvent;
  onEventChanged: (event: WASMEvent) => void;
  toggleOpen: () => void;
}

export const WasmEventRowEditor = ({
  originalEvent,
  onEventChanged,
  toggleOpen,
}: WasmEventRowEditorProps) => {
  const [wasmEvent, setWasmEvent] = useState<WASMEvent>(originalEvent);
  const changeEvent = (key: string, value: string) => {
    if (key === "plane_or_category") {
      if (value.endsWith(",")) {
      }
      console.log("parsing categories");
      console.log(value);
      const parsedValue = parseCategories(value);
      setWasmEvent({ ...wasmEvent, plane_or_category: parsedValue });
      return;
    }
    setWasmEvent({ ...wasmEvent, [key]: value });
  };

  const onSavePressed = () => {
    onEventChanged(wasmEvent);
    toggleOpen();
  };
  return (
    <div className="">
      <Input
        value={wasmEvent.id.toString()}
        label="ID"
        onLight={true}
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
      </div>
    </div>
  );
};
