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
    <div className="bg-bitsanddroids-blue h-screen min-w-screen min-h-screen mt-10 flex flex-col items-center justify-start max-w-[400px]">
      <div className="w-3/4">
        <Header title="Test Page" level={1} />
        <Input
          testid="input_id"
          label="ID"
          onChange={(val) => setId(parseInt(val as string))}
        />
        <Input
          testid="input_value"
          label="Value"
          type="number"
          onChange={(val) => setValue(parseInt(val as string))}
        />
        <Button
          testid="btn_send"
          text="Send"
          addToClassName="mt-4"
          onClick={() => {
            sendEvent();
          }}
        />
      </div>
    </div>
  );
};
