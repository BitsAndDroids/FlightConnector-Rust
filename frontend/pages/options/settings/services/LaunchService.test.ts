import { setupTauriInternalMocks } from "@/tests/testUtils";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { changeLaunchWhenSimStarts } from "./LaunchService";

let mockGetCommunityFolderPath = vi.fn().mockReturnValue("path");
describe("LaunchService", () => {
  let mockInvoke: any;
  vi.mock("@/utils/connectorSettingsHandler", () => ({
    ConnectorSettingsHandler: vi.fn().mockImplementation(() => ({
      getCommunityFolderPath: mockGetCommunityFolderPath,
    })),
  }));

  beforeEach(() => {
    const mocks = setupTauriInternalMocks();
    mockInvoke = mocks.mockInvoke;
  });

  test.sequential("should call launch", async () => {
    await changeLaunchWhenSimStarts(true);
    expect(mockInvoke).toHaveBeenCalledWith(
      "toggle_run_on_sim_launch",
      {
        enable: true,
        exeXmlPath: "path\\exe.xml",
      },
      undefined,
    );
  });

  test.sequential("should call launch with false", async () => {
    await changeLaunchWhenSimStarts(false);
    expect(mockInvoke).toHaveBeenCalledWith(
      "toggle_run_on_sim_launch",
      {
        enable: false,
        exeXmlPath: "path\\exe.xml",
      },
      undefined,
    );
  });

  test.sequential("should not call launch", async () => {
    mockGetCommunityFolderPath = vi.fn().mockReturnValue(null);
    await changeLaunchWhenSimStarts(true);
    expect(mockInvoke).not.toHaveBeenCalled();
  });
});
