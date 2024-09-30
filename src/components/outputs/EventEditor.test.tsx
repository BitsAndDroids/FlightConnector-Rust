import { describe, test, expect } from "vitest";
import { EventEditor } from "./EventEditor";
import { render } from "@testing-library/react";
import { EventErrors } from "@/app/options/outputs/custom/CustomEvents";
import { WASMEvent } from "@/model/WASMEvent";
import { mockEventError } from "@/mocks/MockEventError";

describe("EventEditor", () => {
  test("renders without crashing", async () => {
    const { container } = render(
      <EventEditor
        onSave={function (event: WASMEvent): void {
          throw new Error("Function not implemented.");
        }}
        eventErrors={mockEventError}
        setEventErrors={function (errors: EventErrors): void {
          throw new Error("Function not implemented.");
        }}
      />,
    );
    expect(container).toBeTruthy();
  });
});
