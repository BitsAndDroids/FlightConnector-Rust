import { InfoWindowProps } from "@/components/InfoWindow";
import { ReactElement } from "react";
import { Label } from "../Label";

interface CheckboxProps {
  label?: string;
  value?: boolean;
  onChange?: (value: boolean) => void;
  infoWindow?: ReactElement<InfoWindowProps>;
  required?: boolean;
}
export const Checkbox = ({
  label,
  value,
  onChange,
  infoWindow,
  required,
}: CheckboxProps) => {
  return (
    <div className="flex flex-row items-center">
      {infoWindow}
      <div className="flex flex-col items-start">
        <Label text={label || ""} required={required} />
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange && onChange(e.target.checked)}
        ></input>
      </div>
    </div>
  );
};
