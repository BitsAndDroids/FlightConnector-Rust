import { WASMEvent } from "@/model/WASMEvent";
import { Table } from "../elements/Table";

interface WASMEventTableProps {
  events: WASMEvent[];
  deleteEvent: (id: number) => void;
  editEvent: (id: number) => void;
}

export const WASMEventTable = ({
  events,
  deleteEvent,
  editEvent,
}: WASMEventTableProps) => {
  return (
    <div className="h-full">
      <Table
        headers={[
          "id",
          "action",
          "action_text",
          "action_type",
          "output_format",
          "update_every",
          "plane_or_category",
        ]}
        elements={events}
        deleteById={deleteEvent}
        editById={editEvent}
      />
    </div>
  );
};
