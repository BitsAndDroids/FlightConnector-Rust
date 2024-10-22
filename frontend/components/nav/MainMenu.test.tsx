import { render } from "@testing-library/react";
import { beforeEach, describe, expect, test } from "vitest";
import { MainMenu } from "./MainMenu";
import { setupTauriInternalMocks } from "@/tests/testUtils";
import { MemoryRouter } from "react-router-dom";

const getMenuWithMenuRouter = () => {
  return (
    <MemoryRouter>
      <MainMenu />
    </MemoryRouter>
  );
};

describe("MainMenu", () => {
  beforeEach(() => {
    setupTauriInternalMocks();
  });
  test("renders without crashing", () => {
    const { container } = render(getMenuWithMenuRouter());
    expect(container).toBeTruthy();
  });

  test("Renders the main menu", () => {
    const { getByTestId } = render(getMenuWithMenuRouter());
    const element = getByTestId("main_menu");
    expect(element).toBeTruthy();
  });
});
