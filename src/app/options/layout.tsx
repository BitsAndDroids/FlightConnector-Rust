import React from "react";
const OptionsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={"m-8"}>
      <div>
        <a href={"/"} className={"text-white"}>
          Back
        </a>
      </div>
      {children}
    </div>
  );
};

export default OptionsLayout;
