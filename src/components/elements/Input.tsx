import { ReactElement } from "react";
import InfoWindow, { InfoWindowProps } from "../InfoWindow";

interface InputProps {
  label: string;
  value?: string;
  type?: string;
  decimals?: boolean;
  infoWindow?: ReactElement<InfoWindowProps>;
  onChange?: (value: string) => void;
}

export const Input = ({
  label,
  value,
  type,
  decimals,
  infoWindow,
  onChange,
}: InputProps) => {
  return (
    <div className="flex flex-col">
      <label className="mr-2 ml-2">{label}:</label>
      <div className="flex flex-row w-full items-center">
        {type !== "textarea" ? (
          <input
            value={value}
            onChange={(e) => onChange && onChange(e.target.value)}
            type={type}
            className="border border-gray-200 w-full rounded-md p-2 m-2 drop-shadow w"
            step={decimals ? "0.01" : undefined}
          ></input>
        ) : (
          <textarea
            value={value}
            onChange={(e) => onChange && onChange(e.target.value)}
            className="border border-gray-200 w-full rounded-md p-2 m-2 drop-shadow"
          ></textarea>
        )}
        {infoWindow}
      </div>
    </div>
  );
};
