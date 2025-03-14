interface ButtonProps {
  onClick: () => void;
  text: string;
  style?: "primary" | "secondary" | "danger";
  addToClassName?: string;
  testid?: string;
}

export const Button = ({
  onClick,
  text,
  style,
  addToClassName,
  testid,
}: ButtonProps) => {
  const primary =
    "rounded-md h-10 bg-green-600 text-white text-sm font-semibold px-3.5 py-2.5 flex flex-row items-center mr-2";
  const danger =
    "bg-red-800 rounded-md h-10 px-3.5 py-2.5 text-white text-sm font-semibold mr-2";
  const styleSwitch = (style: string) => {
    switch (style) {
      case "primary": {
        return `${primary} ${addToClassName}`;
      }
      case "secondary":
        return `${primary} bg-blue-600 ${addToClassName}`;
      case "danger":
        return `${danger} ${addToClassName}`;
      default:
        return `${primary} ${addToClassName}`;
    }
  };

  return (
    <button
      onClick={onClick}
      className={
        styleSwitch(style || "primar") || `${primary} ${addToClassName}`
      }
      data-testid={testid}
    >
      {text}
    </button>
  );
};
