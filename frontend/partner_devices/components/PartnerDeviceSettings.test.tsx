import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PartnerDeviceSettings } from "./PartnerDeviceSettings";
import { BundleSettingsHandler } from "#utils/BundleSettingsHandler";
import { message } from "@tauri-apps/plugin-dialog";
import { PartnerDevices } from "#partner_devices/PartnerDevices";
import { setupTauriInternalMocks } from "#tests/testUtils.js";

// Mock dependencies
vi.mock("@tauri-apps/plugin-dialog", () => ({
  message: vi.fn(),
}));

vi.mock("#utils/BundleSettingsHandler", () => ({
  BundleSettingsHandler: vi.fn().mockImplementation(() => ({
    doesBundleExist: vi.fn(),
    addBundleSettings: vi.fn(),
  })),
}));

vi.mock("#partner_devices/PartnerDevices", () => ({
  PartnerDevices: [
    {
      name: "Test Device 1",
      madeBy: "Test Manufacturer 1",
      imageUrl: "test-image-1.jpg",
      bundle: { name: "bundle1" },
    },
    {
      name: "Test Device 2",
      madeBy: "Test Manufacturer 2",
      imageUrl: "test-image-2.jpg",
      bundle: { name: "bundle2" },
    },
  ],
}));

describe("PartnerDeviceSettings", () => {
  const mockOnConfirm = vi.fn();
  const mockSetDialogOpen = vi.fn();

  beforeEach(() => {
    setupTauriInternalMocks();
    vi.clearAllMocks();
  });

  it("renders all partner devices", () => {
    render(<PartnerDeviceSettings setDialogOpen={mockSetDialogOpen} />);

    expect(screen.getByText("Test Device 1")).toBeInTheDocument();
    expect(screen.getByText("Test Device 2")).toBeInTheDocument();
    expect(screen.getAllByText("Add to connector")).toHaveLength(2);
  });

  it("handles close button click", () => {
    render(<PartnerDeviceSettings setDialogOpen={mockSetDialogOpen} />);

    fireEvent.click(screen.getByText("close"));
    expect(mockSetDialogOpen).toHaveBeenCalledWith(false);
  });

  it("renders device images correctly", () => {
    render(<PartnerDeviceSettings setDialogOpen={mockSetDialogOpen} />);

    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute("src", "test-image-1.jpg");
    expect(images[1]).toHaveAttribute("src", "test-image-2.jpg");
  });

  it("displays manufacturer information", () => {
    render(<PartnerDeviceSettings setDialogOpen={mockSetDialogOpen} />);

    expect(
      screen.getByText("made by: Test Manufacturer 1"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("made by: Test Manufacturer 2"),
    ).toBeInTheDocument();
  });
});
