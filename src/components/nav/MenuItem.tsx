import Link from "next/link";

interface MenuItemProps {
  text: string;
  href: string;
}
const MenuItem = (props: MenuItemProps) => {
  return (
    <Link href={props.href} className={"p-2 bg-bitsanddroids-blue hover:bg-bitsanddroids-blue-light"}>
      {props.text}
    </Link>
  )
}

export default MenuItem;
