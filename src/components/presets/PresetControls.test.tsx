import { render } from "@testing-library/react";
import PresetControls from "./PresetControls";
import { describe, test, expect } from "vitest";
import { Preset } from "@/model/Preset";

describe("PresetControls", async () => {
  test("renders without crashing", async () => {
    const { container } = render(
      <PresetControls
        setPreset={function (preset: Preset): void {
          throw new Error("Function not implemented.");
        }}
        setPresets={function (presets: Preset[]): void {
          throw new Error("Function not implemented.");
        }}
      />,
    );
    expect(container).toBeTruthy();
  });
});
