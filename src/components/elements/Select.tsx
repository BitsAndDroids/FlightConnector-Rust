interface SelectProps {
  label: string;
  value?: string;
  options: string[];
  values: string[];
  onChange?: (value: string) => void;
}

export const Select = ({
  label,
  value,
  options,
  values,
  onChange,
}: SelectProps) => {
  return (
    <div className="flex flex-col">
      <label className="mr-2 ml-2">{label}:</label>
      <select
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        className="border border-gray-200 rounded-md p-2 m-2 drop-shadow w"
      >
        {options.map((option, index) => (
          <option key={option} value={values[index]}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};
