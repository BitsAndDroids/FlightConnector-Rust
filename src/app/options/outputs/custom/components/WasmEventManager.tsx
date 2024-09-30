import { WASMEvent } from "@/model/WASMEvent";
import { WasmEventRow } from "./WasmEventRow";
import { WasmEventFilter } from "./WasmEventFilter";

interface WasmEventManagerProps {
  events: WASMEvent[];
}
export const WasmEventManager = (props: WasmEventManagerProps) => {
  return (
    <div className="w-full flex flex-col">
      <div>WasmEventManager</div>
      <div className="flex flex-row w-full">
        <WasmEventFilter />
        <div className="flex flex-col w-full overflow-y-scroll max-h-[800px]">
          {props.events.map((event, index) => (
            <div key={index} className="mb-2">
              <WasmEventRow index={index} key={event.id} event={event} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
