import { WASMEvent } from "@/model/WASMEvent";
import { WasmEventRow } from "./WasmEventRow";
import { WasmEventFilter } from "./WasmEventFilter";
import { useEffect, useState } from "react";
import { WasmEventFilterParams } from "../models/WasmEventFilter";
import { Header } from "@/components/elements/header";
import { CustomEventHandler } from "@/utils/CustomEventHandler";

interface WasmEventManagerProps {
  events: WASMEvent[];
  updateEvents: () => void;
}

const filterEvents = (
  events: Array<WASMEvent>,
  filter: WasmEventFilterParams,
) => {
  let filteredEvents = events;
  if (filter.query) {
    filteredEvents = filteredEvents.filter(
      (event) =>
        event.action_text.toLowerCase().includes(filter.query.toLowerCase()) ||
        event.action.toLowerCase().includes(filter.query.toLowerCase()),
    );
  }
  if (filter.type !== "All") {
    filteredEvents = filteredEvents.filter(
      (event) => event.action_type.toLowerCase() === filter.type.toLowerCase(),
    );
  }
  if (filter.category && filter.category !== "All") {
    filteredEvents = filteredEvents.filter((event) =>
      event.plane_or_category.includes(filter.category.toLowerCase()),
    );
  }
  return filteredEvents;
};

export const WasmEventManager = (props: WasmEventManagerProps) => {
  const [events, setEvents] = useState<WASMEvent[]>(props.events);
  const [filteredEvents, setFilteredEvents] = useState<WASMEvent[]>(
    props.events,
  );
  const [filter, setFilter] = useState<WasmEventFilterParams>({
    query: "",
    category: "All",
    type: "All",
  });

  const updateEvent = (event: WASMEvent) => {
    const eventHandler = new CustomEventHandler();
    eventHandler.updateEvent(event);
    props.updateEvents();
  };

  const onFilterChange = (filter: WasmEventFilterParams) => {
    setFilter(filter);
  };

  const onEventChanged = (event: WASMEvent) => {
    const index = events.findIndex((e) => e.id === event.id);
    if (index === -1) {
      return;
    }
    const newEvents = [...events];
    newEvents[index] = event;
    setEvents(newEvents);
  };

  useEffect(() => {
    setFilteredEvents(filterEvents(events, filter));
  }, [filter, events]);

  return (
    <div className="w-full flex flex-col">
      <Header level={1} title="Custom events" />
      <div className="flex flex-row w-full">
        <WasmEventFilter filter={filter} setFilter={onFilterChange} />
        <div className="flex flex-col w-full overflow-y-scroll max-h-[650px]">
          {filteredEvents.map((event, index) => (
            <div key={index} className="mb-2 mr-4">
              <WasmEventRow
                updateEvent={updateEvent}
                index={index}
                key={event.id}
                event={event}
                onEventChanged={onEventChanged}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};