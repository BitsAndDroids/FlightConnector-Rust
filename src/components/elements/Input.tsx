import { ReactElement } from "react";
import InfoWindow, { InfoWindowProps } from "../InfoWindow";

interface InputProps {
  label?: string;
  value?: string;
  type?: string;
  addToClassName?: string;
  placeholder?: string;
  decimals?: boolean;
  infoWindow?: ReactElement<InfoWindowProps>;
  onChange?: (value: string) => void;
}

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
    <div className="flex flex-col">
      {label && <label className="mr-2 ml-2">{label}:</label>}
      <div className="flex flex-row w-full items-center">
        {type !== "textarea" ? (
          <input
            value={value}
            onChange={(e) => onChange && onChange(e.target.value)}
            type={type}
            className={`border border-gray-200 w-full rounded-md p-2 m-2 drop-shadow ${addToClassName}`}
            step={decimals ? "0.01" : undefined}
            placeholder={placeholder}
          ></input>
        ) : (
          <textarea
            value={value}
            onChange={(e) => onChange && onChange(e.target.value)}
            className={`border border-gray-200 w-full rounded-md p-2 m-2 drop-shadow ${addToClassName}`}
            placeholder={placeholder}
          ></textarea>
        )}
        {infoWindow}
      </div>
    </div>
  );
};
