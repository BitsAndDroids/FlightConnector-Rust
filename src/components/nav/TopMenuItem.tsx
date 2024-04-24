import { SubmenuItem } from "./SubmenuItem";
import { MenuItem } from "./MenuItem";
import { SubMenu } from "./SubMenu";

interface MenuItemProps {
  text: string;
  href: string;
  subMenuItems?: MenuItem[];
}
export const TopMenuItem = (props: MenuItemProps) => {
  return (
    <div className="flex flex-row items-center mr-4 relative group/a cursor-pointer">
      {!props.subMenuItems ? (
        <a href={props.href} className={"p-2 bg-bitsanddroids-blue"}>
          {props.text}
        </a>
      ) : (
        <div className="m-2 group/a cursor-pointer relative text-white roundend-md mr-4">
          <p className="group">{props.text}</p>
          <span className="absolute -right-4 bottom-1 text-white text-xs">
            ▼
          </span>
          <div className="group-hover/a:visible invisible peer-hover:visible">
            <SubMenu items={props.subMenuItems} />
          </div>
          <div className="absolute peer group/a inset-0 z-50 p-4 flex items-center justify-center h-12 w-full">
            <div className="group/a peer pointer-events-auto bg-transparent p-4 h-12 w-full"></div>
          </div>
        </div>
      )}
    </div>
  );
};
