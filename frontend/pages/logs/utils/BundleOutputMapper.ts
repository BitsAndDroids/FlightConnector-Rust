import { RunBundlePopulated } from "#model/RunBundle.js";

export const mapBundleArrayOutputsToMap = (
  bundles: RunBundlePopulated[],
): Map<string, string> => {
  const outputMap = new Map<string, string>();
  bundles.forEach((bundle) => {
    bundle.bundle?.outputs?.forEach((output) => {
      outputMap.set(output.simvar, "");
    });
  });
  return outputMap;
};
