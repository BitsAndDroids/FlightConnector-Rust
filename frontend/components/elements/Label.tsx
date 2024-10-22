interface LabelProps {
  text: string;
  required?: boolean;
  onLight?: boolean;
}
export const Label = ({ text, required, onLight }: LabelProps) => {
  return (
    <label className={onLight ? "text-gray-600" : "text-white"}>
      {text}
      {required && "*"}:
    </label>
  );
};
