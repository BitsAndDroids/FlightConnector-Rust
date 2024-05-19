import { Button } from "@/components/elements/Button";
import { Header } from "@/components/elements/header";
import { EventEditor } from "@/components/outputs/EventEditor";
import { WASMEventTable } from "@/components/wasm/WASMEventTable";
import { WASMEvent } from "@/model/WASMEvent";
import { CustomEventHandler } from "@/utils/CustomEventHandler";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

export const CustomEvents = () => {
  const [events, setEvents] = useState<WASMEvent[]>([]);
  const [eventEditorOpen, setEventEditorOpen] = useState<boolean>(false);
  const [eventToEdit, setEventToEdit] = useState<WASMEvent | undefined>(
    undefined,
  );
  const wasmStore = new CustomEventHandler();
  useEffect(() => {
    const fetchWasmEvents = async () => {
      let events = await invoke("get_wasm_events").then((events: any) => {
        return events as WASMEvent[];
      });

      events.sort((a, b) => a.id - b.id);
      setEvents(events);
    };
    fetchWasmEvents();
  }, []);

  const addEvent = async () => {
    console.log("add event");
    setEventEditorOpen(true);
  };

  const saveEvent = async (event: WASMEvent) => {
    console.log("save event", event);
    wasmStore.addEvent(event);
    if (eventToEdit) {
      const newEvents = events.map((e) => {
        if (e.id === event.id) {
          return event;
        }
        return e;
      });
      setEvents(newEvents);
      setEventToEdit(undefined);
      setEventEditorOpen(false);
      return;
    }
    const newEvents = [...events, event];
    newEvents.sort((a, b) => a.id - b.id);
    setEvents(newEvents);
    setEventToEdit(undefined);
    setEventEditorOpen(false);
  };

  const deleteEvent = async (id: number) => {
    wasmStore.deleteEvent(id);
    const newEvents = events.filter((event) => event.id !== id);
    setEvents(newEvents);
  };

  const editEvent = async (id: number) => {
    console.log("edit", id);
    setEventToEdit(events.find((event) => event.id === id));
    setEventEditorOpen(true);
  };

  const closeEventEditor = () => {
    setEventToEdit(undefined);
    setEventEditorOpen(false);
  };

  const updateDefaultEvents = async () => {
    await invoke("update_default_events");
    const events = await invoke("get_wasm_events").then((events: any) => {
      return events as WASMEvent[];
    });
    events.sort((a, b) => a.id - b.id);
    setEvents(events);
  };

  return (
    <>
      {eventEditorOpen && (
        <EventEditor
          onSave={saveEvent}
          event={eventToEdit}
          onCancel={closeEventEditor}
        />
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
          <Button
            text="Refresh default events"
            onClick={updateDefaultEvents}
            style="primary"
            addToClassName="mt-10 mb-4 ml-2"
          />
        </div>
        <WASMEventTable
          events={events}
          deleteEvent={deleteEvent}
          editEvent={editEvent}
        />
      </div>
    </>
  );
};
