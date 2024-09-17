interface TabHeaderProps {
  name: string;
  first: boolean;
  index: number;
  collapsed: boolean;
  toggleCollapsed: (name: string) => void;
}

const TabHeader = ({
  name,
  first,
  index,
  collapsed,
  toggleCollapsed,
}: TabHeaderProps) => {
  return (
    <div
      className={`${!collapsed ? `bg-sky-100 z-[${index}] hover:bg-sky-300 ` : " bg-sky-200 z-30 "} p-2 relative drop-shadow-md rounded-t-lg  ${first ? "ml-0" : "ml-[-10px]"} h-10`}
      onClick={() => toggleCollapsed(name)}
    >
      <h2 className={`${collapsed ? "font-bold" : "font-normal"}`}>{name}</h2>
    </div>
  );
};

export default TabHeader;
