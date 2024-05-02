import { WASMEvent } from "@/model/WASMEvent";
import { Table } from "../elements/Table";

interface WASMEventTableProps {
  events: WASMEvent[];
}

export const WASMEventTable = ({ events }: WASMEventTableProps) => {
  return (
    <div className="h-full overflow-y-hidden">
      <Table
        headers={[
          "id",
          "action",
          "action_text",
          "action_type",
          "output_format",
          "update_every",
          "min",
          "max",
          "plane_or_category",
        ]}
        elements={events}
      />
    </div>
  );
};
