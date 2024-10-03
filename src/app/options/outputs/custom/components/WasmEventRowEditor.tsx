import { Button } from "@/components/elements/Button";
import { Input } from "@/components/elements/inputs/Input";
import { Select } from "@/components/elements/Select";
import { WASMEvent } from "@/model/WASMEvent";
import { stringifyCategories } from "../utils/stringifyCategories";
import { useState } from "react";

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
  const checkLastCharOfCategories = (categories: string) => {
    return categories.endsWith(",");
  };
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

  const parseCategories = (categories: string) => {
    if (checkLastCharOfCategories(categories)) {
      categories = categories + " ";
    }
    return categories.split(",").map((c) => c.trim());
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
      />
      <Input
        value={wasmEvent.action_text}
        label="Checkbox text"
        onLight={true}
        onChange={(value) => {
          changeEvent("action_text", value as string);
        }}
      />
      <Input
        value={wasmEvent.action}
        label="Action"
        onLight={true}
        onChange={(value) => {
          changeEvent("action", value as string);
        }}
      />
      <Input
        value={stringifyCategories(wasmEvent.plane_or_category)}
        label="Categories (separated by comma)"
        onLight={true}
        onChange={(value) => {
          changeEvent("plane_or_category", value as string);
        }}
      />
      {wasmEvent.action_type === "output" && (
        <Input
          value={wasmEvent.output_format}
          label="Output format"
          onLight={true}
          onChange={(value) => {
            changeEvent("output_format", value as string);
          }}
        />
      )}
      {wasmEvent.action_type === "output" && (
        <Input
          value={wasmEvent.update_every.toString()}
          type="number"
          label="Update every"
          onLight={true}
          onChange={(value) => {
            changeEvent("update_every", value as string);
          }}
        />
      )}
      <Select
        value={wasmEvent.action_type}
        label="Action type"
        onLight={true}
        options={["input", "output"]}
        values={["input", "output"]}
        onChange={(value) => {
          changeEvent("action_type", value as string);
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
