import { describe, test, expect } from "vitest";
import { SubMenu } from "./SubMenu";
import { render } from "@testing-library/react";
import { MenuItem } from "./model/MenuItem";
import { MemoryRouter } from "react-router-dom";

const getMenuItems = (): MenuItem[] => {
  return [
    {
      title: "itemA",
    },
    {
      title: "itemB",
    },
  ];
};

const getMenuWithMemoryRouter = () => {
  return (
    <MemoryRouter>
      <SubMenu items={getMenuItems()} />
    </MemoryRouter>
  );
};

describe("SubMenu", () => {
  test("renders without crashing", () => {
    const { container } = render(getMenuWithMemoryRouter());
    expect(container).toBeTruthy();
  });

  test("renders both menu items", () => {
    const { getByText } = render(getMenuWithMemoryRouter());
    expect(getByText("itemA")).toBeTruthy();
    expect(getByText("itemB")).toBeTruthy();
  });
});
