import { createContext, Dispatch, SetStateAction, useState } from "react";

export const RunStateContext = createContext<{
  connectionRunning: boolean;
  setConnectionRunning: Dispatch<SetStateAction<boolean>>;
}>({ connectionRunning: false, setConnectionRunning: () => {} });

export const RunStateContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [connectionRunning, setConnectionRunning] = useState(false);
  return (
    <RunStateContext.Provider
      value={{ connectionRunning, setConnectionRunning }}
    >
      {children}
    </RunStateContext.Provider>
  );
};
