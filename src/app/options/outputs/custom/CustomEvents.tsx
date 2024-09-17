import { Button } from "@/components/elements/Button";
import { Select } from "@/components/elements/Select";
import { Header } from "@/components/elements/header";
import { Input, InputErrorState } from "@/components/elements/inputs/Input";
import { EventEditor } from "@/components/outputs/EventEditor";
import { WASMEventTable } from "@/components/wasm/WASMEventTable";
import { WASMEvent } from "@/model/WASMEvent";
import { CustomEventHandler } from "@/utils/CustomEventHandler";
import { invoke } from "@tauri-apps/api/core";
import { message } from "@tauri-apps/plugin-dialog";
import { useEffect, useState } from "react";

interface SortSettings {
  sortBy: keyof WASMEvent;
  sortOrder: "desc" | "asc";
  outputFormat: string | undefined;
  type: string | undefined;
}

export interface EventErrors {
  id: InputErrorState;
  action: InputErrorState;
  action_text: InputErrorState;
}

const sortEvents = (
  sortSettings: SortSettings,
  events: WASMEvent[],
): WASMEvent[] => {
  const sortedEvents = [...events].sort((a, b) => {
    const aValue = a[sortSettings.sortBy];
    const bValue = b[sortSettings.sortBy];
    console.log(
      `Sorting by: ${sortSettings.sortBy}, aValue: ${aValue}, bValue: ${bValue}, sortOrder: ${sortSettings.sortOrder}`,
    );
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortSettings.sortOrder === "asc"
        ? bValue - aValue
        : aValue - bValue;
    }
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortSettings.sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    return 0;
  });
  return sortedEvents;
};

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
  const [eventErrors, setEventErrors] = useState<EventErrors>({
    id: { state: false },
    action: { state: false },
    action_text: { state: false },
  });
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
      setFilteredEvents(events);
    };
    fetchWasmEvents();
  }, []);

  useEffect(() => {
    const sorted = sortEvents(sortSettings, events);
    setFilteredEvents(sorted);
  }, [sortSettings, events]);

  const addEvent = async () => {
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

  const validateEmptyString = async (event: WASMEvent) => {
    if (event.action_text.length < 1) {
      setEventErrors({
        ...eventErrors,
        action_text: { state: true, message: "This field must be filled" },
      });
    }
    if (event.action.length < 1) {
      setEventErrors({
        ...eventErrors,
        action: { state: true, message: "This field must be filled" },
      });
    }
  };

  const saveEvent = async (event: WASMEvent) => {
    await validateEmptyString(event);
    // TODO: Fix this double validation logic
    if (
      eventErrors.id.state ||
      eventErrors.action.state ||
      eventErrors.action_text.state ||
      event.action.length < 1 ||
      event.action_text.length < 1
    ) {
      message("You need to fix the errors before saving the event");
      return;
    }
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
    setFilteredEvents(newEvents);
    setEventToEdit(undefined);
    setEventEditorOpen(false);
  };

  const deleteEvent = async (id: number) => {
    wasmStore.deleteEvent(id);
    const newEvents = events.filter((event) => event.id !== id);
    setEvents(newEvents);
    setFilteredEvents(newEvents);
  };

  const editEvent = async (id: number) => {
    setEventToEdit(events.find((event) => event.id === id));
    setEventEditorOpen(true);
  };

  const resetEventErrors = () => {
    setEventErrors({
      id: { state: false, message: "" },
      action: { state: false, message: "" },
      action_text: { state: false, message: "" },
    });
  };

  const closeEventEditor = () => {
    setEventToEdit(undefined);
    resetEventErrors();
    setEventEditorOpen(false);
  };

  const updateDefaultEvents = async () => {
    await invoke("update_default_events");
    const events = await invoke("get_wasm_events").then((events: any) => {
      return events as WASMEvent[];
    });
    events.sort((a, b) => a.id - b.id);
    setEvents(events);
    setFilteredEvents(events);
  };

  const searchId = (searchFor: string) => {
    const filteredEvents = events.filter(
      (event) =>
        event.id.toString().includes(searchFor) ||
        event.action.includes(searchFor) ||
        event.action_text.includes(searchFor),
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
          eventErrors={eventErrors}
          setEventErrors={setEventErrors}
        />
      )}
      <div className="h-[96%] overflow-y-hidden">
        <div className="flex flew-row align-middle items-center mt-4">
          <Header level={1} title="Custom Events" addToClassName="mt-0" />
          <Button
            text="Add Event"
            onClick={addEvent}
            style="primary"
            addToClassName="ml-4"
          />
          <Button
            text="Refresh default events"
            onClick={updateDefaultEvents}
            style="primary"
            addToClassName=""
          />
          <Input
            placeholder="Search"
            addToClassName="mt-2"
            onChange={searchId as (value: string | boolean) => void}
          />
          <Select
            label="Sort By"
            labelPosition="top"
            options={keyArray}
            values={keyArray}
            value={sortSettings.sortBy}
            onChange={changeSortBy}
            addToClassName="-mt-4 text-white"
          />
          <Select
            label="Sort Order"
            labelPosition="top"
            options={["asc", "desc"]}
            values={["asc", "desc"]}
            value={sortSettings.sortOrder}
            onChange={changeSortOrder}
            addToClassName="-mt-4 text-white"
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
