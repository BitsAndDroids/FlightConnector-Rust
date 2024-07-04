import { InfoWindowProps } from "@/components/InfoWindow";
import { ReactElement } from "react";
import { InputErrorState } from "../Input";

interface TextAreaProps {
  value?: string;
  label?: string;
  addToClassName?: string;
  placeholder?: string;
  infoWindow?: ReactElement<InfoWindowProps>;
  errorState?: InputErrorState;
  required?: boolean;
  onChange?: (value: string) => void;
}

export const TextArea = ({
  value,
  label,
  addToClassName,
  placeholder,
  infoWindow,
  errorState,
  required,
  onChange,
}: TextAreaProps) => {
  return (
    <div className="flex flex-col">
      {label && (
        <label className="mr-2">
          {label}
          {required && "*"}:
        </label>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        className={`border border-gray-200 w-full rounded-md p-2 my-2 drop-shadow ${addToClassName} ${errorState?.state && "border-red-800"}`}
        placeholder={placeholder}
      ></textarea>
      {errorState && <p className="text-red-800 ml-4">{errorState.message}</p>}

      {infoWindow}
    </div>
  );
};
