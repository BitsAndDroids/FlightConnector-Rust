import { useNavigate } from "react-router-dom";
import { MenuItem } from "./MenuItem";

interface SubmenuItemProps {
  menuItem: MenuItem;
}

export const SubmenuItem = (props: SubmenuItemProps) => {
  const navigate = useNavigate();
  const navigateToPage = () => {
    // navigate to the route with react-router-dom
    if (!props.menuItem.route) return;
    navigate(props.menuItem.route);
  };
  return (
    <div className="py-2 z-50 hover:bg-gray-100 hover:rounded-md w-full text-center">
      {props.menuItem.action ? (
        <button onClick={props.menuItem.action} className="w-full text-center">
          {props.menuItem.title}
        </button>
      ) : (
        <button onClick={() => navigateToPage()} className="w-full text-center">
          {props.menuItem.title}
        </button>
      )}
    </div>
  );
};
