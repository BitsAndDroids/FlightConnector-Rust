import { ReactNode, useEffect, useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";
interface InputDialogProps {
  message: string;
  value?: string;
  placeholder?: string;
  setDialogOpen?: (open: boolean) => void;
  onConfirm: (input?: string) => void;
  InfoWindow?: ReactNode;
}

export const FileDialog = (props: InputDialogProps) => {
  const [errorState, setErrorState] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [selectedDirectory, setSelectedDirectory] = useState<
    string | null | undefined
  >();

  useEffect(() => {
    if (props.value) {
      setSelectedDirectory(props.value);
    }
  }, []);

  function validateInput(input: string) {
    if (!input || input.length === 0) {
      setErrorState(true);
      setErrorMessage("The name can't be empty");
      return false;
    } else {
      setErrorState(false);
      setErrorMessage("");
      return true;
    }
  }

  function handleConfirm() {
    if (selectedDirectory === undefined || selectedDirectory === null) {
      setErrorState(true);
      setErrorMessage("Please select a directory");
      return;
    }
    props.onConfirm(selectedDirectory);
  }

  const openDirectoryDialog = async () => {
    const dir = await open({
      directory: true,
    });
    setSelectedDirectory(dir);
  };

  return (
    <div className="w-[100%] h-[100%] min-h-[100%] min-w-[100%] -translate-y-1/2 -translate-x-1/2 fixed top-1/2 left-1/2 bg-opacity-50 z-50 flex flew-row align-middle justify-center items-center backdrop-blur-sm drop-shadow-lg">
      <div className="flex flex-col mb-16 rounded-md w-fit h-fit bg-white p-8 border-gray-200 border">
        <div className="flex flex-row justify-center items-center">
          <label className="rounded-md mx-2 text-center">{props.message}</label>
          {props.InfoWindow && props.InfoWindow}
        </div>
        {errorMessage && errorState && (
          <label className="rounded-md mx-2 text-center text-red-800">
            {errorMessage}
          </label>
        )}
        <input
          className={`drop-shadow border rounded-md p-2 m-2 ${errorState ? "border-pink-300" : "border-gray-200"}`}
          placeholder={props.placeholder}
          value={selectedDirectory || ""}
          onChange={(e) => setSelectedDirectory(e.target.value)}
        />
        <div className="flex flex-row justify-center">
          <button
            className="rounded-md bg-bitsanddroids-blue text-white p-2 m-2"
            onClick={() => openDirectoryDialog()}
          >
            Select directory
          </button>
          <button
            className="bg-green-800 rounded-md p-2 m-2 text-white"
            onClick={() => handleConfirm()}
          >
            Confirm
          </button>
          <button
            className="bg-red-800 rounded-md p-2 m-2 text-white"
            onClick={() => props.onConfirm(undefined)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
