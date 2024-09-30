import { describe, test, expect, beforeEach } from "vitest";
import MenuLayout from "./MenuLayout";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { setupTauriInternalMocks } from "@/tests/testUtils";

const getMenuWithMenuRouter = () => {
  return (
    <MemoryRouter>
      <MenuLayout />
    </MemoryRouter>
  );
};
describe("MenuLayout", () => {
  beforeEach(() => {
    setupTauriInternalMocks();
  });
  test("renders without crashing", () => {
    const { container } = render(getMenuWithMenuRouter());
    expect(container).toBeTruthy();
  });
});
