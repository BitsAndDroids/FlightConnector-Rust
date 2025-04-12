import { Bundle } from "#model/Bundle.js";
import { RunBundlePopulated } from "#model/RunBundle.js";
import { createContext, Dispatch, SetStateAction, useState } from "react";

export const RunStateContext = createContext<{
  connectionRunning: boolean;
  setConnectionRunning: Dispatch<SetStateAction<boolean>>;
  bundles: Array<Bundle>;
  setBundles: Dispatch<SetStateAction<Array<Bundle>>>;
  currentRunBundle: Array<RunBundlePopulated>;
  setCurrentRunBundle: Dispatch<SetStateAction<Array<RunBundlePopulated>>>;
}>({
  connectionRunning: false,
  setConnectionRunning: () => {},
  bundles: [],
  setBundles: () => {},
  currentRunBundle: [
    {
      id: 0,
      com_port: "",
      connected: false,
      bundle: { name: "", version: 0 },
    },
  ],
  setCurrentRunBundle: () => {},
});

export const RunStateContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [connectionRunning, setConnectionRunning] = useState(false);
  const [currentRunBundle, setCurrentRunBundle] = useState([
    {
      id: 0,
      com_port: "",
      connected: false,
      bundle: { name: "", version: 0 },
    },
  ]);
  const [bundles, setBundles] = useState<Array<Bundle>>([]);
  return (
    <RunStateContext.Provider
      value={{
        connectionRunning,
        setConnectionRunning,
        bundles,
        setBundles,
        currentRunBundle,
        setCurrentRunBundle,
      }}
    >
      {children}
    </RunStateContext.Provider>
  );
};
