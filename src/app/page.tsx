'use client';

import {useEffect, useState} from "react";
import {invoke} from "@tauri-apps/api/tauri";
import "./globals.css";
import {listen} from "@tauri-apps/api/event";
import Link from "next/link";

// same type as payload

function App() {
    type Payload = {
        message: string;
    };

    const [greetMsg, setGreetMsg] = useState("");
    const [name, setName] = useState("");
    const [data, setData] = useState<string>("");
    const [comPorts, setComPorts] = useState<string[]>([]);
    const [comPort, setComPort] = useState<string>("");

    useEffect(() => {
        async function getComPorts() {
            const ports = await invoke("get_com_ports");
            console.log(ports);
            setComPort((ports as string[])[0]);
            setComPorts(ports as string[]);
        }

        async function getData() {
            await listen<Payload>('event-name', (event) => {
                console.log(event.payload.message);
                setData(event.payload.message);
            });
        }

        getData();
        getComPorts();
    }, []);

    async function start_com_connection() {
        // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
        setGreetMsg(await invoke("start_com_connection", {port: comPort}));
    }

    return (
        <div className="flex justify-center align-middle  h-full w-full flex-col ">
            <div className="flex flex-col justify-center align-middle items-center">
                <h1 className={"mt-10 text-2xl font-bold tracking-tight text-white sm:text-4xl"}>CONNECTOR TEST</h1>
                <p>{data || "0"} </p>
            </div>
            <form
                className="flex flex-row justify-center align-middle"
                onSubmit={(e) => {
                    e.preventDefault();
                    start_com_connection();
                }}
            >
                <input
                    className={"rounded m-2 p-2 text-gray-700"}
                    onChange={(e) => setName(e.currentTarget.value)}
                    placeholder="Enter a name..."
                />
                <select
                    className={"rounded m-2 text-gray-700 p-2"}
                    onChange={(e) => {
                        console.log(e.currentTarget.value);
                        setComPort(e.currentTarget.value);
                    }}
                >
                    {comPorts.map((port) => (
                        <option className={"text-gray-700"} key={port} value={port}>{port}</option>
                    ))}
                </select>
                <button type="submit" className={"rounded-md bg-indigo-500 px-3.5 py-2.5 m-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"}>Start</button>
            </form>
            <p>{greetMsg}</p>
        </div>
    );
}

export default App;
