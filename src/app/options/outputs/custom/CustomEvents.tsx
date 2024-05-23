import { Button } from "@/components/elements/Button";
import { Input } from "@/components/elements/Input";
import { Select } from "@/components/elements/Select";
import { Header } from "@/components/elements/header";
import { EventEditor } from "@/components/outputs/EventEditor";
import { WASMEventTable } from "@/components/wasm/WASMEventTable";
import { WASMEvent } from "@/model/WASMEvent";
import { CustomEventHandler } from "@/utils/CustomEventHandler";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

interface SortSettings {
  sortBy: keyof WASMEvent;
  sortOrder: "desc" | "asc";
  outputFormat: string | undefined;
  type: string | undefined;
}
export const CustomEvents = () => {
  const [sortSettings, setSortSettings] = useState<SortSettings>({
    sortBy: "id",
    sortOrder: "asc",
    outputFormat: undefined,
    type: undefined,
  });
  const [events, setEvents] = useState<WASMEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<WASMEvent[]>([]);
  const [eventEditorOpen, setEventEditorOpen] = useState<boolean>(false);
  const [eventToEdit, setEventToEdit] = useState<WASMEvent | undefined>(
    undefined,
  );
  const keyArray: Array<keyof WASMEvent> = [
    "id",
    "action_type",
    "output_format",
    "update_every",
    "plane_or_category",
  ];

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

  useEffect(() => {
    sortEvents();
  }, [sortSettings]);

  const sortEvents = () => {
    const sortedEvents = filteredEvents.sort((a, b) => {
      const aValue = a[sortSettings.sortBy];
      const bValue = b[sortSettings.sortBy];
      console.log(
        `Sorting by: ${sortSettings.sortBy}, aValue: ${aValue}, bValue: ${bValue}, sortOrder: ${sortSettings.sortOrder}`,
      );
      if (typeof aValue === "number" && typeof bValue === "number") {
        console.log("number sort");
        return sortSettings.sortOrder === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }
      if (typeof aValue === "string" && typeof bValue === "string") {
        console.log("string sort");
        return sortSettings.sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        console.log("default sort");
        return 0;
      }
    });
    setFilteredEvents(sortedEvents);
  };

  const addEvent = async () => {
    console.log("add event");
    setEventEditorOpen(true);
  };

  const changeSortBy = (sortBy: string) => {
    if (!keyArray.includes(sortBy as keyof WASMEvent)) {
      return;
    }
    setSortSettings((prevSettings) => ({
      ...prevSettings,
      sortBy: sortBy as keyof WASMEvent,
    }));
  };

  const changeSortOrder = (sortOrder: string) => {
    if (sortOrder !== "asc" && sortOrder !== "desc") {
      return;
    }
    setSortSettings((oldSettings) => ({
      ...oldSettings,
      sortOrder: sortOrder as "asc" | "desc",
    }));
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

  const searchId = async (id: string) => {
    const filteredEvents = events.filter((event) =>
      event.id.toString().includes(id),
    );
    setFilteredEvents(filteredEvents);
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
          <Input
            placeholder="Search by id"
            addToClassName="mt-10"
            onChange={(id: string) => searchId(id)}
          />
          <Select
            label="Sort By"
            labelPosition="top"
            options={keyArray}
            values={keyArray}
            value={sortSettings.sortBy}
            onChange={(e) => changeSortBy(e)}
            addToClassName="mt-2 text-white"
          />
          <Select
            label="Sort Order"
            labelPosition="top"
            options={["asc", "desc"]}
            values={["asc", "desc"]}
            value={sortSettings.sortOrder}
            onChange={(e) => changeSortOrder(e)}
            addToClassName="mt-2 text-white"
          />
        </div>
        <WASMEventTable
          events={filteredEvents}
          deleteEvent={deleteEvent}
          editEvent={editEvent}
        />
      </div>
    </>
  );
};
