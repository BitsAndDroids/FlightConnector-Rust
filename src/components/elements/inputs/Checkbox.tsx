import { InfoWindowProps } from "@/components/InfoWindow";
import { ReactElement } from "react";
import { Label } from "../Label";

interface CheckboxProps {
  label?: string;
  value?: boolean;
  onChange?: (value: boolean) => void;
  infoWindow?: ReactElement<InfoWindowProps>;
  required?: boolean;
  onLight?: boolean;
}
export const Checkbox = ({
  label,
  value,
  onChange,
  infoWindow,
  required,
  onLight,
}: CheckboxProps) => {
  return (
    <div className="flex flex-row items-center">
      {infoWindow}
      <div className="flex flex-col items-start">
        {" "}
        <Label text={label || ""} required={required} onLight={onLight} />
        <input
          className="h-5 w-5 mr-2 focus:ring-green-500 text-green-600 rounded-md"
          type="checkbox"
          checked={value}
          onChange={(e) => onChange && onChange(e.target.checked)}
        ></input>
      </div>
    </div>
  );
};
