import { Dispatch, SetStateAction } from "react";
import { ControllerSelectComponent } from "./ControllerSelectComponent";
export const RunComponent = () => {
  return (
    <div className={"flex flex-col w-full justify-center items-center"}>
      <ControllerSelectComponent />
    </div>
  );
};
