// <select
//     className={"rounded m-2 text-gray-700 p-2"}
// onChange={(e) => {
//     console.log(e.currentTarget.value);
//     setComPort(e.currentTarget.value);
// }}
// >
// {comPorts.map((port) => (
//     <option className={"text-gray-700"} key={port} value={port}>{port}</option>
// ))}
// </select>

import { Bundle } from "@/model/Bundle";

interface ControllerSelectProps {
  comPorts: string[];
  bundles: Bundle[];
  setComPort: (port: string) => void;
}

export const ControllerSelect: React.FC<ControllerSelectProps> = (props) => {
  return (
    <div>
      <select
        // generate a unique key for each select element
        key={Math.random()}
        className={"rounded m-2 text-gray-700 p-2"}
        onChange={(e) => {
          console.log(e.currentTarget.value);
          props.setComPort(e.currentTarget.value);
        }}
      >
        {props.comPorts.map((port) => (
          <option className={"text-gray-700"} key={port} value={port}>
            {port}
          </option>
        ))}
      </select>
      <select
        key={Math.random()}
        className={"rounded m-2 text-gray-700 p-2"}
        onChange={(e) => {
          console.log(e.currentTarget.value);
          props.setComPort(e.currentTarget.value);
        }}
      >
        <option
          key={Math.random()}
          value={"No outputs"}
          className={"text-gray-700"}
        >
          No outputs
        </option>
        {props.bundles.length > 0 &&
          props.bundles.map((bundle) => (
            <option
              className={"text-gray-700"}
              key={bundle.name}
              value={bundle.name}
            >
              {bundle.name}
            </option>
          ))}
      </select>
    </div>
  );
};

