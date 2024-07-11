interface LabelProps {
  text: string;
  required?: boolean;
  light?: boolean;
}

export const Label = ({ text, required, light }: LabelProps) => {
  return (
    <label className={`${light ? "text-white" : "text-gray-600"}`}>
      {text}
      {required && "*"}:
    </label>
  );
};
