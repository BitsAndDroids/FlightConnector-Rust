import { ReactElement } from "react";
import { InfoWindowProps } from "../InfoWindow";
import { Label } from "./Label";

interface SelectProps {
  label?: string;
  labelPosition?: "top" | "left";
  value?: string;
  options: string[];
  values: string[];
  onLight?: boolean;
  addToClassName?: string;
  infoWindow?: ReactElement<InfoWindowProps>;
  onChange?: (value: string) => void;
}

export const Select = ({
  label,
  labelPosition,
  value,
  options,
  values,
  onLight,
  addToClassName,
  infoWindow,
  onChange,
}: SelectProps) => {
  return (
    <div
      className={
        labelPosition == "left"
          ? `flex flex-row ${addToClassName}`
          : `flex flex-col ${addToClassName}`
      }
    >
      {label && <Label text={label} onLight={onLight} />}
      <div className={"flex flex-row items-center w-full text-gray-800"}>
        <select
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          className="border border-gray-200 w-full rounded-md p-2 mb-2 mr-2 drop-shadow w"
        >
          {options.map((option, index) => (
            <option key={option} value={values[index]}>
              {option}
            </option>
          ))}
        </select>
        {infoWindow}
      </div>
    </div>
  );
};
