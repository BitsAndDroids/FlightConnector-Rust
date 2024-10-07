import { WASMEvent } from "@/model/WASMEvent";
import { WasmEventRow } from "./WasmEventRow";
import { WasmEventFilter } from "./WasmEventFilter";
import { useEffect, useState } from "react";
import { WasmEventFilterParams } from "../models/WasmEventFilter";
import { Header } from "@/components/elements/header";
import { CustomEventHandler } from "@/utils/CustomEventHandler";
import { invoke } from "@tauri-apps/api/core";
import { ConnectorSettingsHandler } from "@/utils/connectorSettingsHandler";

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
      event.plane_or_category.includes(filter.category.toLowerCase()),
    );
  }
  return filteredEvents;
};
const connectorSettingsHandler = new ConnectorSettingsHandler();

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
  const [customEventVersion, setCustomEventVersion] = useState<string>();
  const [latestCustomEventVersion, setLatestCustomEventVersion] = useState<
    string | undefined | null
  >(undefined);

  const updateEvent = (event: WASMEvent) => {
    const eventHandler = new CustomEventHandler();
    eventHandler.updateEvent(event);
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
    updateEvent(event);
    setEvents(newEvents);
  };

  useEffect(() => {
    const fetchCustomEventVersion = async () => {
      const customEventVersion =
        await connectorSettingsHandler.getLastCustomEventVersion();
      console.log(customEventVersion);
      if (!customEventVersion) {
        setCustomEventVersion("none");
        return;
      }
      setCustomEventVersion(customEventVersion as string);
    };
    const fetchLatestCustomEventVersion = async () => {
      invoke("get_latest_custom_event_version").then((result) => {
        console.log(result);
        setLatestCustomEventVersion(result as string);
      });
    };

    const compareVersions = () => {
      console.log("Comparing versions");
      if (customEventVersion !== latestCustomEventVersion) {
        console.log("Reloading custom events");
        invoke("reload_custom_events");
        console.log("Setting latest version");
        console.log(customEventVersion);
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
      <Header level={1} title="Custom events" />
      <div className="flex flex-row w-full overflow-y-scroll">
        <WasmEventFilter filter={filter} setFilter={onFilterChange} />
        <div className="flex flex-col w-full  max-h-[650px] relative">
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
