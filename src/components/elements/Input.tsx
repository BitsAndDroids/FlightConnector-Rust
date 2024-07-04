import { ReactElement } from "react";
import InfoWindow, { InfoWindowProps } from "../InfoWindow";
import { Checkbox } from "./inputs/Checkbox";
import { TextArea } from "./inputs/TextArea";

interface InputProps {
  label?: string;
  value?: string | boolean;
  type?: string;
  addToClassName?: string;
  placeholder?: string;
  decimals?: boolean;
  infoWindow?: ReactElement<InfoWindowProps>;
  errorState?: InputErrorState;
  required?: boolean;
  onChange?: (value: string | boolean) => void;
}

export interface InputErrorState {
  state: boolean;
  message?: string;
}
const generateCheckbox = (
  value: boolean,
  label: string,
  onChange: (value: boolean) => void,
) => {
  return <Checkbox value={value} label={label} onChange={onChange} />;
};

export const Input = ({
  label,
  value,
  type,
  addToClassName,
  placeholder,
  decimals,
  infoWindow,
  errorState,
  required,
  onChange,
}: InputProps) => {
  return (
    <>
      {type === "checkbox" ? (
        <Checkbox
          value={value as boolean}
          label={label as string}
          onChange={onChange as (value: boolean) => void}
          infoWindow={infoWindow}
        />
      ) : type === "textarea" ? (
        <TextArea
          value={value as string}
          label={label}
          addToClassName={addToClassName as string}
          placeholder={placeholder as string}
          errorState={errorState}
          required={required}
          onChange={onChange as (value: string) => void}
        />
      ) : (
        <div className="flex flex-col">
          {label && (
            <label className="mr-2">
              {label}
              {required && "*"}:
            </label>
          )}
          <div className="flex flex-row w-full items-center">
            <div className="flex flex-col mr-4">
              <input
                value={value as string}
                onChange={(e) => onChange && onChange(e.target.value)}
                type={type}
                className={`border border-gray-200 w-full rounded-md p-2 my-2 drop-shadow ${addToClassName} ${errorState?.state && "border-red-800 focus-visible:border-red-800"}`}
                step={decimals ? "0.01" : undefined}
                placeholder={placeholder}
              ></input>
              {errorState?.state && (
                <p className="text-red-900 ml-4 -mt-2">{errorState?.message}</p>
              )}
            </div>
            {infoWindow}
          </div>
        </div>
      )}
    </>
  );
};
