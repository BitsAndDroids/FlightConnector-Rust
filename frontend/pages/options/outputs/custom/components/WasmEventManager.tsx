import { WASMEvent } from "@/model/WASMEvent";
import { WasmEventRow } from "./WasmEventRow";
import { WasmEventFilter } from "./WasmEventFilter";
import { useEffect, useState } from "react";
import { WasmEventFilterParams } from "../model/WasmEventFilter";
import { Header } from "@/components/elements/header";
import { CustomEventHandler } from "@/utils/CustomEventHandler";
import { invoke } from "#tauri/invoke";
import { ConnectorSettingsHandler } from "@/utils/connectorSettingsHandler";
import { Button } from "@/components/elements/Button";
import { EventEditor } from "./EventEditor";

interface WasmEventManagerProps {
  events: WASMEvent[];
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
      event.plane_or_category.find((cat) =>
        cat.toLowerCase().includes(filter.category),
      ),
    );
  }
  if (filter.madeBy && filter.madeBy !== "All") {
    if (filter.madeBy === "Me") {
      filteredEvents = filteredEvents.filter(
        (event) => event.made_by === "User",
      );
    }
    if (filter.madeBy === "BitsAndDroids") {
      filteredEvents = filteredEvents.filter(
        (event) => event.made_by === "BitsAndDroids",
      );
    }
  }
  return filteredEvents;
};
const connectorSettingsHandler = new ConnectorSettingsHandler();
const eventHandler = new CustomEventHandler();
export const WasmEventManager = (props: WasmEventManagerProps) => {
  const [eventEditorVisible, setEventEditorVisible] = useState(false);
  const [events, setEvents] = useState<WASMEvent[]>(props.events);
  const [filteredEvents, setFilteredEvents] = useState<WASMEvent[]>(
    props.events,
  );
  const [filter, setFilter] = useState<WasmEventFilterParams>({
    query: "",
    category: "All",
    type: "All",
    madeBy: "All",
  });
  const [customEventVersion, setCustomEventVersion] = useState<string>();
  const [latestCustomEventVersion, setLatestCustomEventVersion] = useState<
    string | undefined | null
  >(undefined);

  const onSaveEvent = (event: WASMEvent) => {
    const newEvents = [...events];
    newEvents.push(event);
    setEvents(newEvents);
    setFilteredEvents(filterEvents(newEvents, filter));
    eventHandler.addEvent(event);
    setEventEditorVisible(false);
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
    eventHandler.updateEvent(event);
  };

  useEffect(() => {
    const fetchCustomEventVersion = async () => {
      const customEventVersion =
        await connectorSettingsHandler.getLastCustomEventVersion();
      if (!customEventVersion) {
        setCustomEventVersion("none");
        return;
      }
      setCustomEventVersion(customEventVersion as string);
    };

    const fetchLatestCustomEventVersion = async () => {
      invoke("get_latest_custom_event_version").then((result) => {
        setLatestCustomEventVersion(result as string);
      });
    };

    const compareVersions = () => {
      if (customEventVersion !== latestCustomEventVersion) {
        invoke("reload_custom_events");
        connectorSettingsHandler.setLastCustomEventVersion(
          latestCustomEventVersion as string,
        );
      }
    };

    fetchCustomEventVersion();
    fetchLatestCustomEventVersion();
    if (
      customEventVersion &&
      (latestCustomEventVersion || latestCustomEventVersion === "none")
    ) {
      compareVersions();
    }
  }, [customEventVersion, latestCustomEventVersion]);

  useEffect(() => {
    setFilteredEvents(filterEvents(events, filter));
  }, [filter, events]);

  return (
    <div className="w-full flex flex-col">
      {eventEditorVisible && (
        <EventEditor
          onSave={function (event: WASMEvent): void {
            onSaveEvent(event);
          }}
          onCancel={() => {
            setEventEditorVisible(false);
          }}
          events={events}
        />
      )}
      <div className="flex flex-row items-center">
        <Header level={1} title="Custom events" />
        <Button
          onClick={() => {
            setEventEditorVisible(true);
          }}
          text="Add event"
          addToClassName="mt-6 ml-4"
        />
      </div>
      <div className="flex flex-row w-full ">
        <WasmEventFilter filter={filter} setFilter={onFilterChange} />
        <div className="flex flex-col w-full  max-h-[650px] overflow-y-scroll relative">
          {filteredEvents.map((event, index) => (
            <div key={index} className="mb-2 mr-4 relative ">
              <WasmEventRow
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
