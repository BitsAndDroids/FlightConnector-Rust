import { ReactElement } from "react";
import { InfoWindowProps } from "../../InfoWindow";
import { Checkbox } from "./Checkbox";
import { TextArea } from "./TextArea";
import { Label } from "../Label";
import { getInputSize, InputSize } from "./utils/SizeParser";

interface InputProps {
  label?: string;
  value?: string | boolean;
  type?: string;
  addToClassName?: string;
  placeholder?: string;
  decimals?: boolean;
  infoWindow?: ReactElement<InfoWindowProps>;
  errorState?: InputErrorState;
  mt?: number;
  infoLeft?: boolean;
  required?: boolean;
  onLight?: boolean;
  size?: InputSize;
  onChange?: (value: string | boolean) => void;
  testid?: string;
}

export interface InputErrorState {
  state: boolean;
  message?: string;
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
  errorState,
  mt,
  infoLeft,
  required,
  onLight,
  size,
  onChange,
  testid,
}: InputProps) => {
  return (
    <>
      {type === "checkbox" ? (
        <Checkbox
          value={value as boolean}
          label={label as string}
          onChange={onChange as (value: boolean) => void}
          infoWindow={infoWindow}
          onLight={onLight}
        />
      ) : type === "textarea" ? (
        <TextArea
          testid={testid}
          value={value as string}
          label={label}
          addToClassName={addToClassName as string}
          placeholder={placeholder as string}
          errorState={errorState}
          required={required}
          onLight={onLight}
          onChange={onChange as (value: string) => void}
        />
      ) : (
        <div
          className={`flex flex-row ${mt && `mt-${mt}`} items-center align-start overflow-visible`}
        >
          <div className="flex flex-col w-full overflow-visible">
            {label && (
              <Label onLight={onLight} text={label} required={required} />
            )}
            <div className="flex flex-col mr-2 overflow-visible">
              <div className="flex flex-row align-middle items-center overflow-visible mb-2">
                {infoLeft && <div className="mr-2">{infoWindow}</div>}
                <input
                  data-testid={testid}
                  value={value as string}
                  onChange={(e) => onChange && onChange(e.target.value)}
                  type={type}
                  className={`border border-gray-200 w-full rounded-md p-2  drop-shadow ${addToClassName} ${errorState?.state && "border-red-800 focus-visible:border-red-800"} ${size ? getInputSize(size) : ""}`}
                  step={decimals ? "0.01" : undefined}
                  placeholder={placeholder}
                ></input>
                {!infoLeft && <div className="ml-2">{infoWindow}</div>}
              </div>
              {errorState?.state && (
                <p className="text-red-900 ml-4 -mt-2">{errorState?.message}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
