import { Header } from "@/components/elements/header";
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
    <div className="h-[99%] overflow-y-hidden">
      <Header level={1} title="Custom Events" />
      <WASMEventTable events={events} />
    </div>
  );
};
