import { WASMEvent } from "@/model/WASMEvent";

interface WASMEventTableProps {
  events: WASMEvent[];
}

export const WASMEventTable = ({ events }: WASMEventTableProps) => {
  return (
    <table>
      <tr>
        <th>ID</th>
        <th>Event</th>
        <th>Checkbox text</th>
        <th>Action type</th>
        <th>Output format</th>
        <th>Update every</th>
        <th>Min</th>
        <th>Max</th>
        <th>Category</th>
      </tr>
      <tbody>
        {events.map((event) => (
          <tr key={event.id}>
            <td>{event.id}</td>
            <td>{event.action}</td>
            <td>{event.action_text}</td>
            <td>{event.action_type}</td>
            <td>{event.output_format}</td>
            <td>{event.update_every}</td>
            <td>{event.min}</td>
            <td>{event.max}</td>
            <td>{event.plane_or_category}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
