import { render } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { PresetList } from "./PresetList";
import { Preset } from "@/model/Preset";

describe("PresetList", async () => {
  test("renders without crashing", async () => {
    const { container } = render(
      <PresetList
        presets={[]}
        viewPreset={function (preset: Preset): void {
          throw new Error("Function not implemented.");
        }}
        deletePreset={function (preset: Preset): void {
          throw new Error("Function not implemented.");
        }}
      />,
    );
    expect(container).toBeTruthy();
  });
});
