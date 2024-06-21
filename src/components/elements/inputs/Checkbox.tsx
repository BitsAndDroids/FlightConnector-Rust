import { InfoWindowProps } from "@/components/InfoWindow";
import { ReactElement } from "react";

interface CheckboxProps {
  label?: string;
  value?: boolean;
  onChange?: (value: boolean) => void;
  infoWindow?: ReactElement<InfoWindowProps>;
}
export const Checkbox = ({
  label,
  value,
  onChange,
  infoWindow,
}: CheckboxProps) => {
  return (
    <div className="flex flex-row items-center">
      {infoWindow}
      <label className="mr-2 ">{label}:</label>
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange && onChange(e.target.checked)}
      ></input>
    </div>
  );
};
