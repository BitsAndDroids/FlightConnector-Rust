import { InputErrorState } from "@/components/elements/inputs/Input";
import { WASMEvent } from "@/model/WASMEvent";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { WasmEventManager } from "./components/WasmEventManager";
import { EventEditor } from "./components/EventEditor";

export interface EventErrors {
  id: InputErrorState;
  action: InputErrorState;
  action_text: InputErrorState;
}

const fetchWasmEvents = async () => {
  let events = await invoke("get_wasm_events").then((events: any) => {
    return events as WASMEvent[];
  });

  events.sort((a, b) => a.id - b.id);
  return events as WASMEvent[];
};

export const CustomEvents = () => {
  const [eventEditorOpen, setEventEditorOpen] = useState(false);
  const [events, setEvents] = useState<WASMEvent[]>([]);

  const updateEvents = () => {
    fetchWasmEvents().then((events) => setEvents(events));
  };

  useEffect(() => {
    fetchWasmEvents().then((events) => setEvents(events));
  }, []);

  return (
    <>
      {eventEditorOpen && (
        <EventEditor
          onSave={() => {}}
          onCancel={() => setEventEditorOpen(false)}
        />
      )}
      <div
        className="h-[96%] overflow-y-hidden"
        data-testid="custom_event_page"
      >
        <div className="flex flew-row align-middle items-center mt-4">
          {events.length > 0 && (
            <WasmEventManager events={events} updateEvents={updateEvents} />
          )}
        </div>
      </div>
    </>
  );
};
