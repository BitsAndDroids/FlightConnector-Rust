import React from "react";

interface MenuItemProps {
  text: string;
  href: string;
}
const MenuItem = (props: MenuItemProps) => {
  return (
    <a
      href={props.href}
      className={"p-2 bg-bitsanddroids-blue hover:bg-bitsanddroids-blue-light"}
    >
      {props.text}
    </a>
  );
};

export default MenuItem;
