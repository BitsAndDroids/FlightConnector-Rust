import { InfoWindowProps } from "@/components/InfoWindow";
import { ReactElement } from "react";

interface TextAreaProps {
  value?: string;
  label?: string;
  addToClassName?: string;
  placeholder?: string;
  infoWindow?: ReactElement<InfoWindowProps>;
  onChange?: (value: string) => void;
}

export const TextArea = ({
  value,
  label,
  addToClassName,
  placeholder,
  infoWindow,
  onChange,
}: TextAreaProps) => {
  return (
    <div className="flex flex-col">
      {label && <label className="mr-2 ml-2">{label}:</label>}
      <textarea
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        className={`border border-gray-200 w-full rounded-md p-2 m-2 drop-shadow ${addToClassName}`}
        placeholder={placeholder}
      ></textarea>

      {infoWindow}
    </div>
  );
};
