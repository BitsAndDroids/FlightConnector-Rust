import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { EventEditor } from "./EventEditor";
import { WASMEvent } from "@/model/WASMEvent";

describe("EventEditor", () => {
  test("should render without crashing", () => {
    const { container } = render(
      <EventEditor
        onSave={function (event: WASMEvent): void {}}
        onCancel={function (): void {}}
        events={[]}
      />,
    );
    expect(container).toBeTruthy();
  });
});
