"use client";
import { Bundle } from "@/model/Bundle";
import { RunBundle } from "@/model/RunBundle";
import { Suspense } from "react";
interface ControllerSelectProps {
  comPorts: string[];
  selectedComPort?: string;
  bundles: Bundle[];
  setComPort: (comPort: string, runBundle: any) => void;
  setBundle: (bundle: string, runBundle: any) => void;
  removeRow: (id: number) => void;
  runBundle?: RunBundle;
}

export const ControllerSelect: React.FC<ControllerSelectProps> = (
  props: ControllerSelectProps,
) => {
  return (
    <Suspense>
      {" "}
      <div
        className="flex flex-row items-center relative"
        data-testid="controller_select"
      >
        {props?.runBundle?.connected && (
          <div>
            <div className="rounded-lg w-4 h-4 min-w-4 min-h-4 bg-green-400 mr-1 absolute -left-4 top-5" />
          </div>
        )}
        {!props?.runBundle?.connected && (
          <div>
            <div className="rounded-lg w-4 h-4 min-w-4 min-h-4 bg-red-400 mr-1 absolute -left-4 top-5" />
          </div>
        )}

        <select
          key={Math.random()}
          data-testid="com_port_select"
          className={"rounded m-2 text-gray-700 p-2 w-[180px] pr-8"}
          value={props?.runBundle?.com_port}
          onChange={(e) => {
            console.log(e.currentTarget.value);
            props?.setComPort(e.currentTarget.value, props.runBundle);
          }}
        >
          {props?.comPorts?.map((port) => (
            <option className={"text-gray-700"} key={port} value={port}>
              {port}
            </option>
          ))}
        </select>
        <select
          key={Math.random()}
          className={"rounded m-2 text-gray-700 p-2 w-[300px]"}
          value={props?.runBundle?.bundle_name || ""}
          onChange={(e) => {
            console.log(e.currentTarget.value);
            props.setBundle(e.currentTarget.value, props.runBundle);
          }}
        >
          <option
            key={Math.random()}
            value={"No outputs"}
            className={"text-gray-700"}
          >
            No outputs
          </option>
          {props?.bundles?.length > 0 &&
            props.bundles?.map((bundle) => (
              <option
                className={"text-gray-700"}
                key={bundle.name}
                value={bundle.name}
              >
                {bundle.name}
              </option>
            ))}
        </select>
        <div onClick={() => props.removeRow(props?.runBundle?.id || 0)}>
          <img
            src={"/trashcan.svg"}
            alt="trashcan"
            className="h-[30px]"
            height={30}
            width={30}
          />
        </div>
      </div>
    </Suspense>
  );
};
