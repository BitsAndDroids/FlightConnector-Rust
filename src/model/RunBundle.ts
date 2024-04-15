import { Bundle } from "./Bundle";
import { BundleSettingsHandler } from "../utils/BundleSettingsHandler";

export interface RunBundle {
  id: number;
  com_port: string;
  connected: boolean;
  bundle_name?: string;
}

export interface RunBundlePopulated extends RunBundle {
  bundle: Bundle;
}

export async function populateRunBundles(
  runBundles: RunBundle[],
): Promise<RunBundlePopulated[]> {
  const populatedRunBundles = await Promise.all(
    runBundles.map(async (runBundle) => {
      if (!runBundle.bundle_name) {
        console.log("No outputs");
        return { ...runBundle, bundle: { outputs: [], name: "", version: 0 } };
      }
      return populateRunBundle(runBundle);
    }),
  );
  return populatedRunBundles;
}

export async function populateRunBundle(
  runBundle: RunBundle,
): Promise<RunBundlePopulated> {
  const bundleSettingsHandler = new BundleSettingsHandler();
  const populatedBundle = await bundleSettingsHandler.getBundleSettingsByName(
    runBundle.bundle_name as string,
  );
  return { ...runBundle, bundle: populatedBundle };
}
