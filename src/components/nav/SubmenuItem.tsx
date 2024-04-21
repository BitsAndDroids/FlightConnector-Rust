import { MenuItem } from "./MenuItem";

interface SubmenuItemProps {
  menuItem: MenuItem;
}
export const SubmenuItem = (props: SubmenuItemProps) => {
  return (
    <>
      {props.menuItem.action ? (
        <button onClick={props.menuItem.action} className="w-full">
          {props.menuItem.title}
        </button>
      ) : (
        <a
          href={props.menuItem.route}
          className="text-black text-center w-full cursor-pointer"
        >
          {props.menuItem.title}
        </a>
      )}
    </>
  );
};
