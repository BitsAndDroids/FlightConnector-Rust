import { ReactNode } from "react";

export const PrimaryCard = ({ children }: { children: ReactNode }) => {
  return (
    <div className="mr-4 shadow-lg box-shadow p-4 bg-gradient-to-b from-[#305d7b] to-[#596d96] bg-opacity-20 rounded-md h-fit">
      {children}
    </div>
  );
};
