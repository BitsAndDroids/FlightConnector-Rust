import { Link, useNavigate } from "react-router-dom";
import { MenuItem } from "./model/MenuItem";

interface SubmenuItemProps {
  menuItem: MenuItem;
}

export const SubmenuItem = (props: SubmenuItemProps) => {
  const navigate = useNavigate();
  return (
    <div className="z-50 hover:bg-gray-100 hover:rounded-md w-full h-full text-center">
      {props.menuItem.action ? (
        <button
          onClick={props.menuItem.action}
          className="w-full text-center p-2 py-4"
        >
          {props.menuItem.title}
        </button>
      ) : (
        <Link
          to={props.menuItem.route || ""}
          className=" text-center p-2 py-4 w-full h-full block"
        >
          {props.menuItem.title}
        </Link>
      )}
    </div>
  );
};
