interface CheckboxProps {
  label?: string;
  value?: boolean;
  onChange?: (value: boolean) => void;
}
export const Checkbox = ({ label, value, onChange }: CheckboxProps) => {
  return (
    <div className="flex flex-row">
      <label className="mr-2 ml-2">{label}:</label>
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange && onChange(e.target.checked)}
      ></input>
    </div>
  );
};
