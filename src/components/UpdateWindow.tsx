import { Suspense, useEffect, useState } from "react";
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
  const [loading, setLoading] = useState<boolean>(true);
  const renderers = {
    h1: (props: any) => <Header level={1} title={props.children} />,
    h2: (props: any) => (
      <Header level={2} title={props.children} addToClassName="text-white" />
    ),
    h3: (props: any) => (
      <Header level={3} title={props.children} addToClassName="text-white" />
    ),
    li: (props: any) => <li className="list-disc">{props.children}</li>,
    ul: (props: any) => <ul className="list-inside mb-4">{props.children}</ul>,
  };
  useEffect(() => {
    const fetchUpdates = async () => {
      const response = await fetch(
        "https://www.bitsanddroids.com/api/release",
        {
          method: "GET",
        },
      );
      const data = await response.json();
      const updates = data;
      setUpdates(updates);
      setLoading(false);
    };
    fetchUpdates();
  }, []);
  return (
    <div
      className="w-[100%] h-[100%] min-h-[100%] min-w-[100%] -translate-y-1/2 -translate-x-1/2 fixed top-1/2 left-1/2 bg-opacity-50 z-50 flex flew-row align-middle justify-center items-center backdrop-blur-sm drop-shadow-lg"
      data-testid="update_window"
    >
      <div className="flex flex-col mb-16 rounded-md w-3/4 h-3/4 bg-gray-800 p-8 border-gray-200 border">
        <div className="flex flex-row items-center w-full">
          <Header level={1} title="Latest release notes" />
          <Button
            onClick={props.closeWindow}
            text="Close"
            style="danger"
            addToClassName="mt-10 ml-4"
          />
        </div>
        <div className="h-3/4 text-white overflow-y-scroll w-full flex flex-col items-center">
          {loading && (
            <div role="status">
              <svg
                aria-hidden="true"
                className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          )}
          {updates.length > 0 &&
            updates.map((update, index) => {
              return (
                <div
                  key={index}
                  data-testid="update"
                  className=" bg-gray-700 py-8 px-6 mb-4 rounded-md w-[95%]"
                >
                  <Header
                    data-testid="update"
                    level={2}
                    title={update.name}
                    addToClassName="text-white mt-2"
                  />
                  <p className="text-sm mb-4">
                    {new Date(update.published).toLocaleDateString()}
                  </p>
                  <Markdown components={renderers}>{update.body}</Markdown>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
