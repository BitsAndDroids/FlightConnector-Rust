import { listen } from "@tauri-apps/api/event";
import { attachConsole } from "@tauri-apps/plugin-log";
import React, { useRef } from "react";
import { useEffect, useState } from "react";

const MAX_LINES = 1000;

export const LogPage: React.FC = () => {
  const [lines, setLines] = useState<Array<string>>([]);
  const [paused, setPaused] = useState<boolean>(false);
  const logEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const pauseLogs = () => {
    console.log("pause logs");
    setPaused(!paused);
  };

  useEffect(() => {
    const unlisten = listen<any>("log://log", ({ payload }) => {
      if (paused) return;
      if (!paused) {
        setLines((lines) => {
          const newLines = [...lines, payload.message];
          return newLines.slice(-MAX_LINES);
        });
      }
    });

    async function attachConsoleToView() {
      const detach = await attachConsole();
      return detach;
    }

    const unAttachLogger = attachConsoleToView();
    return () => {
      unAttachLogger;
      unlisten.then((unlisten: any) => unlisten());
    };
  });
  useEffect(() => {
    scrollToBottom();
  }, [lines]);
  return (
    <div className="bg-bitsanddroids-blue h-screen w-screen p-8  overflow-x-hidden">
      <div className="flex flex-row">
        <h1
          className={
            "mb-4 text-2xl font-bold tracking-tight text-white sm:text-4xl"
          }
        >
          Logs
        </h1>
        {!paused && (
          <button
            className="bg-red-800 text-white p-2 rounded-md mb-3 ml-4"
            onClick={pauseLogs}
          >
            Pause
          </button>
        )}
        {paused && (
          <button
            className="bg-green-600 text-white p-2 rounded-md mb-3 ml-4"
            onClick={pauseLogs}
          >
            Resume
          </button>
        )}
      </div>
      <div className="min-h-[100px] h-4/5 overflow-y-scroll">
        {lines.map((line, index) => (
          <div key={index} ref={logEndRef} className="text-white">
            {line}
          </div>
        ))}
      </div>
    </div>
  );
};
