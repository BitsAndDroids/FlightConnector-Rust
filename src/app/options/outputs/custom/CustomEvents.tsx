import { Button } from "@/components/elements/Button";
import { Header } from "@/components/elements/header";
import { EventEditor } from "@/components/outputs/EventEditor";
import { WASMEventTable } from "@/components/wasm/WASMEventTable";
import { WASMEvent } from "@/model/WASMEvent";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

export const CustomEvents = () => {
  const [events, setEvents] = useState<WASMEvent[]>([]);
  const [eventEditorOpen, setEventEditorOpen] = useState<boolean>(false);
  useEffect(() => {
    const fetchWasmEvents = async () => {
      const events = await invoke("get_wasm_events").then((events: any) => {
        return events as WASMEvent[];
      });
      setEvents(events);
    };
    fetchWasmEvents();
  }, []);

  const addEvent = async () => {
    console.log("add event");
    setEventEditorOpen(true);
  };

  return (
    <>
      {eventEditorOpen && (
        <EventEditor onCancel={() => setEventEditorOpen(false)} />
      )}
      <div className="h-[96%] overflow-y-hidden">
        <div className="flex flew-row align-middle ">
          <Header level={1} title="Custom Events" />
          <Button
            text="Add Event"
            onClick={addEvent}
            style="primary"
            addToClassName="mt-10 mb-4 ml-2"
          />
        </div>
        <WASMEventTable events={events} />
      </div>
    </>
  );
};
