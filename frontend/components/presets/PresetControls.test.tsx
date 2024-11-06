import { fireEvent, render } from "@testing-library/react";
import PresetControls from "./PresetControls";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { Preset } from "@/model/Preset";
import { setupTauriInternalMocks } from "@/tests/testUtils";

let mockUpdatePreset = vi.fn();
let mockAddPreset = vi.fn();
describe("PresetControls", async () => {
  vi.mock("@/utils/PresetSettingsHandler", () => ({
    PresetSettingsHandler: vi.fn().mockImplementation(() => ({
      updatePreset: mockUpdatePreset,
      addPreset: mockAddPreset,
    })),
  }));
  beforeEach(() => {
    setupTauriInternalMocks();
  });

  vi.mock("uuid", () => ({
    v4: vi.fn().mockReturnValue("1"),
  }));

  test("renders without crashing", async () => {
    const { container } = render(
      <PresetControls
        setPreset={function(preset: Preset): void {
          throw new Error("Function not implemented.");
        }}
        setPresets={function(presets: Preset[]): void {
          throw new Error("Function not implemented.");
        }}
      />,
    );
    expect(container).toBeTruthy();
  });

  test("calls setPreset when 'Add row' button is clicked", async () => {
    const mockSetPreset = vi.fn();
    const { getByText } = render(
      <PresetControls
        setPreset={mockSetPreset}
        setPresets={function(presets: Preset[]): void {
          throw new Error("Function not implemented.");
        }}
        activePreset={{
          id: "1",
          version: "1",
          name: "Test",
          runBundles: [],
        }}
      />,
    );

    fireEvent.click(getByText("Add row"));
    expect(mockSetPreset).toHaveBeenCalled();
  });

  test("does not call setPreset when 'Add row' button is clicked and no active preset", async () => {
    const mockSetPreset = vi.fn();
    const { getByText } = render(
      <PresetControls
        setPreset={mockSetPreset}
        setPresets={function(presets: Preset[]): void {
          throw new Error("Function not implemented.");
        }}
      />,
    );

    fireEvent.click(getByText("Add row"));
    expect(mockSetPreset).not.toHaveBeenCalled();
  });
  test("calls updatePreset when 'Save preset' button is clicked", async () => {
    const activePreset: Preset = {
      id: "1",
      version: "1",
      name: "Test",
      runBundles: [],
    };
    const { getByText } = render(
      <PresetControls
        setPreset={vi.fn()}
        setPresets={vi.fn()}
        activePreset={activePreset}
      />,
    );

    fireEvent.click(getByText("Save preset"));
    expect(mockUpdatePreset).toHaveBeenCalledWith(activePreset);
  });
  test("should call setPreset, setPresets, and addPreset with correct arguments when dialogResult is called with input", () => {
    const setPreset = vi.fn();
    const setPresets = vi.fn();
    const presets: Preset[] | undefined = [];

    const { getByTestId } = render(
      <PresetControls
        setPreset={setPreset}
        setPresets={setPresets}
        presets={presets}
      />,
    );

    const dialogButton = getByTestId("create_preset_button");
    fireEvent.click(dialogButton);
    const dialogInput = getByTestId("input_dialog_input");
    fireEvent.input(dialogInput, { target: { value: "test" } });
    fireEvent.click(getByTestId("confirm_dialog_button"));

    const newPreset = {
      id: "1",
      version: "1",
      name: "test",
      runBundles: [
        {
          id: 0,
          com_port: "",
          bundle_name: "",
          connected: false,
        },
      ],
    };

    expect(setPreset).toHaveBeenCalledWith(newPreset);
    expect(setPresets).toHaveBeenCalledWith([...presets, newPreset]);
    expect(mockAddPreset).toHaveBeenCalledWith(newPreset);
  });

  test("Should not render inputdialog whitout dialog click", () => {
    const { queryByTestId } = render(
      <PresetControls
        setPreset={function(preset: Preset): void {
          throw new Error("Function not implemented.");
        }}
        setPresets={function(presets: Preset[]): void {
          throw new Error("Function not implemented.");
        }}
      />,
    );

    expect(queryByTestId("inputdialog")).toBeNull();
  });

  test("Should render inputdialog when dialog click", () => {
    const { getByTestId } = render(
      <PresetControls
        setPreset={function(preset: Preset): void {
          throw new Error("Function not implemented.");
        }}
        setPresets={function(presets: Preset[]): void {
          throw new Error("Function not implemented.");
        }}
      />,
    );
    const dialogButton = getByTestId("create_preset_button");
    fireEvent.click(dialogButton);
    expect(getByTestId("inputdialog")).toBeTruthy();
  });
});
