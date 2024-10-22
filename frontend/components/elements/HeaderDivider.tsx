interface HeaderDividerProps {
  text: string;
}
export const HeaderDivider = ({ text }: HeaderDividerProps) => {
  return (
    <>
      <span className="block w-full h-0.5 bg-gray-300 my-2"></span>
      <h2 className="text-md text-gray-500 my-2">{text}</h2>
      <span className="block w-full h-0.5 bg-gray-300 my-2"></span>
    </>
  );
};
