import { Bundle } from "#model/Bundle.js";
import { createContext, Dispatch, SetStateAction, useState } from "react";

export const RunStateContext = createContext<{
  connectionRunning: boolean;
  setConnectionRunning: Dispatch<SetStateAction<boolean>>;
  bundles: Array<Bundle>;
  setBundles: Dispatch<SetStateAction<Array<Bundle>>>;
}>({
  connectionRunning: false,
  setConnectionRunning: () => {},
  bundles: [],
  setBundles: () => {},
});

export const RunStateContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [connectionRunning, setConnectionRunning] = useState(false);
  const [bundles, setBundles] = useState<Array<Bundle>>([]);
  return (
    <RunStateContext.Provider
      value={{ connectionRunning, setConnectionRunning, bundles, setBundles }}
    >
      {children}
    </RunStateContext.Provider>
  );
};
