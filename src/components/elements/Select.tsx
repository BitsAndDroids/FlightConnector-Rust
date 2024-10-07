import { ReactElement } from "react";
import { InfoWindowProps } from "../InfoWindow";
import { Label } from "./Label";
import { SelectOption } from "@/model/SelectOption";
import { getInputSize, InputSize } from "./inputs/utils/SizeParser";

interface SelectProps {
  label?: string;
  labelPosition?: "top" | "left";
  value?: string;
  options: Array<SelectOption>;
  onLight?: boolean;
  addToClassName?: string;
  infoWindow?: ReactElement<InfoWindowProps>;
  size?: InputSize;
  onChange?: (value: string) => void;
}

export const Select = ({
  label,
  labelPosition,
  value,
  options,
  onLight,
  addToClassName,
  infoWindow,
  size,
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
      <div className={"flex flex-row items-center w-full mb-2 text-gray-800"}>
        <select
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          className={`border border-gray-200 w-full rounded-md p-2  mr-2 drop-shadow ${size ? getInputSize(size) : ""}`}
        >
          {options.map((option) => (
            <option key={option.id || option.value} value={option.value}>
              {option.label || option.value}
            </option>
          ))}
        </select>
        {infoWindow}
      </div>
    </div>
  );
};
