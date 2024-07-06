interface LabelProps {
  text: string;
  required?: boolean;
}

export const Label = ({ text, required }: LabelProps) => {
  return (
    <label className="text-gray-600">
      {text}
      {required && "*"}:
    </label>
  );
};
