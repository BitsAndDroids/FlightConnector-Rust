import { ReactNode } from "react";

interface InputDialogProps {
  message: string;
  placeholder?: string;
  setDialogOpen?: (open: boolean) => void;
  onConfirm: (input?: string) => void;
  InfoWindow?: ReactNode;
}

const InputDialog = (props: InputDialogProps) => {
  return (
    <div className="w-screen h-screen min-h-screen min-w-screen absolute t-0 l-0 bg-opacity-50 z-50 flex flew-row align-middle justify-center items-center backdrop-blur-sm drop-shadow-lg">
      <div className="flex flex-col mb-16 rounded-md w-fit h-fit bg-white p-8 border-gray-200 border">
        <div className="flex flex-row justify-center items-center">
          <label className="rounded-md mx-2 text-center">{props.message}</label>
          {props.InfoWindow && props.InfoWindow}
        </div>
        <input className="drop-shadow border-gray-200 border rounded-md p-2 m-2" placeholder={props.placeholder} />
        <div className="flex flex-row justify-center">
          <button className="bg-green-800 rounded-md p-2 m-2 text-white" onClick={() => props.onConfirm("test")}>Confirm</button>
          <button className="bg-red-800 rounded-md p-2 m-2 text-white" onClick={() => props.onConfirm(undefined)}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default InputDialog;

