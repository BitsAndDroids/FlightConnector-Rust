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

import {useEffect} from "react";

interface ControllerSelectProps {
    comPorts: string[];
    setComPort: (port: string) => void;
}

export const ControllerSelect: React.FC<ControllerSelectProps> = (props) => {

    return (
        <select
            className={"rounded m-2 text-gray-700 p-2"}
            onChange={(e) => {
                console.log(e.currentTarget.value);
                props.setComPort(e.currentTarget.value);
            }}
        >
            {props.comPorts.map((port) => (
                <option className={"text-gray-700"} key={port} value={port}>{port}</option>
            ))}
        </select>
    );
}