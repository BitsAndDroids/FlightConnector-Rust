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
    <>
      {!props.subMenuItems ? (
        <a href={props.href} className={"p-2 bg-bitsanddroids-blue"}>
          {props.text}
        </a>
      ) : (
        <div className="p-2 group cursor-pointer relative text-white roundend-md mr-4">
          <p className="">{props.text}</p>
          <span className="absolute -right-2 bottom-1 text-white text-xs">
            ▼
          </span>
          <div className="relative invisible group-hover:visible">
            <SubMenu items={props.subMenuItems} />
          </div>
        </div>
      )}
    </>
  );
};
