"use client";

import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./globals.css";
import { ControllerSelectComponent } from "@/components/ControllerSelectComponent";
import { RunComponent } from "@/components/RunComponent";

// same type as payload

function App() {
  type Payload = {
    message: string;
  };
  const [temperature, setTemperature] = useState(0);
  const [greetMsg, setGreetMsg] = useState("");
  const [commandId, setCommandId] = useState(0);
  const [name, setName] = useState("");

  async function send_command() {
    invoke("send_command", { command: commandId });
  }

  return (
    <div className="flex justify-center align-middle  h-full w-full flex-col ">
      <div className="flex flex-col justify-center align-middle items-center">
        <h1
          className={
            "mt-10 text-2xl font-bold tracking-tight text-white sm:text-4xl"
          }
        >
          CONNECTOR TEST
        </h1>
      </div>
      <RunComponent />
      <div className={"flex flex-col justify-center align-middle"}>
        <input
          className={
            "rounded-md bg-gray-900 text-white text-sm font-semibold px-3.5 py-2.5 m-2"
          }
          type={"number"}
          placeholder={"Enter command id"}
          onChange={(e) => {
            setCommandId(parseInt(e.target.value));
          }}
        />
        <button
          type="button"
          className={
            "rounded-md bg-green-900 text-white text-sm font-semibold px-3.5 py-2.5 m-2"
          }
          onClick={() => {
            send_command();
          }}
        >
          Send
        </button>
      </div>
      <p>{greetMsg}</p>
    </div>
  );
}

export default App;
