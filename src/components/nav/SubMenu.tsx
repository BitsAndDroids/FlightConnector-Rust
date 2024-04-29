import { MenuItem } from "./MenuItem";
import { SubmenuItem } from "./SubmenuItem";

interface SubMenuProps {
  items: MenuItem[];
}
export const SubMenu = (props: SubMenuProps) => {
  return (
    <div className="flex flex-col absolute cursor-pointer z-[999] drop-shadow m-2 bg-white rounded-md -bottom-18 -right-30 w-[200px] text-black items-center">
      {props.items.length > 0 &&
        props.items.map((item) => {
          if (!item.active) {
            return (
              <div className="hidden w-full">
                <SubmenuItem menuItem={item} />
              </div>
            );
          }
          return <SubmenuItem menuItem={item} />;
        })}
    </div>
  );
};
