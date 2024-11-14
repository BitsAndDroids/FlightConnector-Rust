import { HTMLProps, createElement } from "react";

type HTMLTagName = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
interface HeaderProps {
  title: string;
  level: number;
  onLight?: boolean;
  withSubtitle?: boolean;
  addToClassName?: string;
}

interface Header {
  tag: HTMLTagName;
  style: string;
}

export const Header = (props: HeaderProps) => {
  const levelMap: Map<number, Header> = new Map<number, Header>([
    [
      1,
      {
        tag: "h1",
        style: `text-2xl font-bold tracking-tight ${props.onLight ? "text-gray-800" : "text-white"} sm:text-4xl ${props.withSubtitle ? "mb-0 mt-0" : "mb-4 mt-10"}`,
      },
    ],
    [
      2,
      {
        tag: "h2",
        style: `font-bold text-xl tracking-tight ${props.withSubtitle ? "mb-0 mt-0" : "mb-4 mt-4"} ${props.onLight ? "text-gray-800" : "text-white"}`,
      },
    ],
    [
      3,
      {
        tag: "h3",
        style: `1.17em font-bold text-xl tracking-tight ${props.onLight ? "text-gray-800" : "text-white"} ${props.withSubtitle ? "mb-0 mt-0" : "mb-4 mt-2"} `,
      },
    ],
  ]);
  const header = levelMap.get(props.level);
  const elementProps: HTMLProps<HTMLElement> = {
    className: header
      ? `${header.style} ${props.addToClassName ? props.addToClassName : ""}`
      : `${props.addToClassName ? props.addToClassName : ""}`,
  };

  const customTag = header ? header.tag : "h1";
  return <div>{createElement(customTag, elementProps, props.title)}</div>;
};
