import { ReactElement } from "react";
import { InfoWindowProps } from "../InfoWindow";

interface SelectProps {
  label?: string;
  labelPosition?: "top" | "left";
  value?: string;
  options: string[];
  values: string[];
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
      {label && <label className="mr-2 ml-2">{label}:</label>}
      <div className={"flex flex-row items-center w-full text-gray-800"}>
        <select
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          className="border border-gray-200 w-full rounded-md p-2 m-2 drop-shadow w"
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
