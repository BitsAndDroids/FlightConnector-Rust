import { WASMEvent } from "@/model/WASMEvent";
import { WasmEventRowEditor } from "./WasmEventRowEditor";
import { useState } from "react";
import { stringifyCategories } from "../utils/CategoriesStringUtils";
import { CustomEventHandler } from "@/utils/CustomEventHandler";
import { Checkbox } from "#components/elements/inputs/Checkbox.js";

interface WasmEventRowProps {
  wasmEvent: WASMEvent;
  onEventChanged: (event: WASMEvent) => void;
  onEventDeleted: (id: number) => void;
  onEventSelected: (event: WASMEvent) => void;
  index: number;
}
export const WasmEventRow = ({
  wasmEvent: wasmEvent,
  onEventChanged,
  onEventDeleted,
  onEventSelected,
  index,
}: WasmEventRowProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [animationEnded, setAnimationEnded] = useState<boolean>(true);

  const closeEditor = () => {
    setAnimationEnded(false);
    setOpen(false);
    setTimeout(() => {
      setAnimationEnded(true);
    }, 500);
  };
  return (
    <div
      className=" rounded-md p-4 bg-white bg-gradient-to-r from-[rgba(255,255,255,0.9)] to-[rgba(200,200,220,0.7)] shadow-[inset_0_-2px_4px_rgba(180,180,255,0.9)] drop-shadow flex flex-row align-middle transition ease-in-out delay-150 duration-300"
      onClick={() => {
        if (!open) setOpen(true);
      }}
      data-testid="wasm_event_row"
    >
      <div className="flex flex-col w-full">
        <div className="flex flex-row align-middle items-center w-full">
          <Checkbox
            onChange={() => {
              onEventSelected(wasmEvent);
            }}
          />
          <div className="flex flex-col w-4/5 justify-center">
            <span className="has-tooltip">
              <span
                className={`${index === 0 ? "tooltip-bot" : "tooltip"} rounded shadow-lg p-1 bg-gray-100`}
              >
                {wasmEvent.action}
              </span>
              <p className="text-lg font-bold">{wasmEvent.action_text}</p>
            </span>
            <div className="flex flex-row">
              <span className="has-tooltip">
                <span className="tooltip rounded shadow-lg p-1 bg-gray-100">
                  category
                </span>
                <img
                  src="https://api.iconify.design/tabler:category-2.svg"
                  className={"fill-amber-50 mr-2"}
                  alt="update_every"
                />
              </span>
              <p className="text-xs text-gray-500 ">
                {stringifyCategories(wasmEvent.plane_or_category)}
              </p>
              <p className="text-xs text-gray-500 ml-2">#{wasmEvent.id}</p>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="ml-2 flex flex-row items-center">
              <span className="has-tooltip">
                <span className="tooltip rounded shadow-lg p-1 bg-gray-100">
                  Event type (input/output)
                </span>
                <img
                  src="https://api.iconify.design/iconoir:input-output.svg"
                  className={"fill-amber-50 mr-2"}
                  alt="update_every"
                />
              </span>
              <p className="">{wasmEvent.action_type}</p>
            </div>
            <div className="ml-2 flex flex-row items-center">
              <span className="has-tooltip">
                <span className="tooltip rounded shadow-lg p-1 bg-gray-100">
                  update every X
                </span>
                <img
                  src="https://api.iconify.design/lucide:between-horizontal-start.svg"
                  className={"fill-amber-50 mr-2"}
                  alt="update_every"
                />
              </span>
              <p className="">{wasmEvent.update_every}</p>
            </div>
          </div>
        </div>
        <div
          className={`mt-4 transition-all ease-in-out duration-500 ${open ? "max-h-screen" : "max-h-0"} `}
          data-testid="wasm_event_row_editor"
        >
          {(open || !animationEnded) && (
            <div
              className={`transition-all ease-in-out duration-500 ${open ? "opacity-100" : "opacity-0"}`}
            >
              <WasmEventRowEditor
                onEventDeleted={onEventDeleted}
                originalEvent={wasmEvent}
                toggleOpen={closeEditor}
                onEventChanged={onEventChanged}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
