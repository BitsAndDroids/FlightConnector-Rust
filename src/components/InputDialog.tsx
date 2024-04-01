import { ReactNode, useState } from "react";
import React from "react";

interface InputDialogProps {
  message: string;
  placeholder?: string;
  setDialogOpen?: (open: boolean) => void;
  onConfirm: (input?: string) => void;
  InfoWindow?: ReactNode;
}

const InputDialog = (props: InputDialogProps) => {
  const [errorState, setErrorState] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

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
    let value = document.getElementsByTagName("input")[0].value;
    const valid = validateInput(value);
    if (!valid) return;
    props.onConfirm(value);
  }

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
        />
        <div className="flex flex-row justify-center">
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

export default InputDialog;
