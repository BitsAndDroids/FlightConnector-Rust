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
  onChange?: (value: string | boolean) => void;
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
  onChange,
}: InputProps) => {
  return (
    <>
      {type === "checkbox" ? (
        <Checkbox
          value={value as boolean}
          label={label as string}
          onChange={onChange as (value: boolean) => void}
        />
      ) : type === "textarea" ? (
        <TextArea
          value={value as string}
          addToClassName={addToClassName as string}
          placeholder={placeholder as string}
          onChange={onChange as (value: string) => void}
        />
      ) : (
        <div className="flex flex-col">
          {label && <label className="mr-2 ml-2">{label}:</label>}
          <div className="flex flex-row w-full items-center">
            <input
              value={value as string}
              onChange={(e) => onChange && onChange(e.target.value)}
              type={type}
              className={`border border-gray-200 w-full rounded-md p-2 m-2 drop-shadow ${addToClassName}`}
              step={decimals ? "0.01" : undefined}
              placeholder={placeholder}
            ></input>
            {infoWindow}
          </div>
        </div>
      )}
    </>
  );
};
