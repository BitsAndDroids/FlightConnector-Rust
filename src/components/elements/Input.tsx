interface InputProps {
  label: string;
  value?: string;
  type?: string;
  decimals?: boolean;
  onChange?: (value: string) => void;
}

export const Input = ({
  label,
  value,
  type,
  decimals,
  onChange,
}: InputProps) => {
  return (
    <div className="flex flex-col">
      <label className="mr-2 ml-2">{label}:</label>
      {type !== "textarea" ? (
        <input
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          type={type}
          className="border border-gray-200 rounded-md p-2 m-2 drop-shadow w"
          step={decimals ? "0.01" : undefined}
        ></input>
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          className="border border-gray-200 rounded-md p-2 m-2 drop-shadow"
        ></textarea>
      )}
    </div>
  );
};
