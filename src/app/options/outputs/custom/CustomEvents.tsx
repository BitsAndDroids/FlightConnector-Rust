import { WASMEventTable } from "@/components/wasm/WASMEventTable";
import { WASMEvent } from "@/model/WASMEvent";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

export const CustomEvents = () => {
  const [events, setEvents] = useState<WASMEvent[]>([]);
  useEffect(() => {
    const fetchWasmEvents = async () => {
      const events = await invoke("get_wasm_events").then((events: any) => {
        return events as WASMEvent[];
      });
      setEvents(events);
    };
    fetchWasmEvents();
  }, []);
  return (
    <div>
      <WASMEventTable events={events} />
    </div>
  );
};
