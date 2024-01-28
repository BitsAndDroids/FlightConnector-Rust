interface InputDialogProps {
  message: string;
  input_hint?: string;
  onConfirm: (input: string) => void;
}

const InputDialog = (props: InputDialogProps) => {
  return (
    <div className="w-full h-full min-h-screen min-w-screen absolute t-0 l-0 bg-white bg-opacity-50 z-50 flex flew-row align-middle justify-center items-center">
      <div className="flex flex-row rounded-md w-fit h-fit bg-white p-8">
        <label className="bg-gray-800 rounded-md p-2 m-2 text-white">{props.message}</label>
        <input className="bg-gray-800 rounded-md p-2 m-2 text-white" placeholder={props.input_hint} />
        <button className="bg-gray-800 rounded-md p-2 m-2 text-white" onClick={() => props.onConfirm("test")}>Confirm</button>
      </div>
    </div>
  );
}

export default InputDialog;

