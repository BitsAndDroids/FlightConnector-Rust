import { useEffect, useState } from "react";
import { Header } from "./elements/header";
import Markdown from "react-markdown";
import { Button } from "./elements/Button";

interface UpdateWindowProps {
  closeWindow: () => void;
}
interface Update {
  name: string;
  version: string;
  published: string;
  body: string;
}

export const UpdateWindow = (props: UpdateWindowProps) => {
  let [updates, setUpdates] = useState<Update[]>([] as Update[]);
  useEffect(() => {
    const fetchUpdates = async () => {
      const response = await fetch(
        "https://www.bitsanddroids.com/api/release",
        {
          method: "GET",
        },
      );
      const data = await response.json();
      updates = data;
      setUpdates(updates);
    };
    fetchUpdates();
  }, []);
  return (
    <div className="w-[100%] h-[100%] min-h-[100%] min-w-[100%] -translate-y-1/2 -translate-x-1/2 fixed top-1/2 left-1/2 bg-opacity-50 z-50 flex flew-row align-middle justify-center items-center backdrop-blur-sm drop-shadow-lg">
      <div className="flex flex-col mb-16 rounded-md w-3/4 h-3/4 bg-gray-800 p-8 border-gray-200 border">
        <div className="flex flex-row items-center">
          <Header level={1} title="Latest release notes" />
          <Button
            onClick={props.closeWindow}
            text="Close"
            style="danger"
            addToClassName="mt-10 ml-4"
          />
        </div>
        <div className="h-3/4 text-white overflow-y-scroll">
          {updates.length > 0 &&
            updates.map((update, index) => {
              return (
                <div key={index} className="w-full py-2">
                  <Header level={2} title={update.name} />
                  <p className="text-sm">{update.published}</p>
                  <Markdown children={update.body} />
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
