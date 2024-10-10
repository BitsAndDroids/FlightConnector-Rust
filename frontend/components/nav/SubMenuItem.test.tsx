import { describe, expect, test } from "vitest";
import { SubmenuItem } from "./SubmenuItem";
import { MemoryRouter } from "react-router-dom";
import { MenuItem } from "./model/MenuItem";
import { render } from "@testing-library/react";

const getMenuWithMemoryRouter = () => {
  return (
    <MemoryRouter>
      <SubmenuItem menuItem={{ title: "itemA" }} />
    </MemoryRouter>
  );
};
describe("SubMenuItem", () => {
  test("renders without crashing", () => {
    const { container } = render(getMenuWithMemoryRouter());
    expect(container).toBeTruthy();
  });

  test("renders menu item", () => {
    const { getByText } = render(getMenuWithMemoryRouter());
    expect(getByText("itemA")).toBeTruthy();
  });
});
