import { Button } from "#components/elements/Button.js";
import { Header } from "#components/elements/header.js";
import { Input } from "#components/elements/inputs/Input.js";
import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";

export const TestPage = () => {
  const [id, setId] = useState<number>(0);
  const [value, setValue] = useState<number>(0);
  const sendEvent = () => {
    invoke("send_debug_message", { message: { id: id, value: value } });
  };
  return (
    <div className="bg-bitsanddroids-blue h-screen min-w-screen min-h-screen -mt-10">
      <Header title="Test Page" level={1} />
      <Input label="ID" onChange={(val) => setId(parseInt(val as string))} />
      <Input
        label="Value"
        type="number"
        onChange={(val) => setValue(parseInt(val as string))}
      />
      <Button
        text="Send"
        onClick={() => {
          sendEvent();
        }}
      />
    </div>
  );
};
