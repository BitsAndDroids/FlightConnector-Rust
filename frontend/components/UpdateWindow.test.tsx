import { describe, test, expect, beforeAll, afterEach, afterAll } from "vitest";
import { UpdateWindow } from "./UpdateWindow";
import { setupServer } from "msw/node";
import { screen, render } from "@testing-library/react";
import { handlers } from "@/mocks/handlers";
describe("UpdateWindow", () => {
  const server = setupServer(...handlers);

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  test("renders UpdateWindow component", async () => {
    const { container } = render(
      <UpdateWindow
        closeWindow={function (): void {
          throw new Error("Function not implemented.");
        }}
      />,
    );
    expect(container).toBeTruthy();
  });

  test("renders Updates", async () => {
    const { findAllByTestId } = render(
      <UpdateWindow
        closeWindow={function (): void {
          throw new Error("Function not implemented.");
        }}
      />,
    );
    const updateElement = await findAllByTestId("update");
    expect(updateElement).toBeTruthy();
  });

  test("renders the correct number of updates", async () => {
    const { findAllByTestId } = render(
      <UpdateWindow
        closeWindow={function (): void {
          throw new Error("Function not implemented.");
        }}
      />,
    );
    const updateElements = await findAllByTestId("update");
    expect(updateElements).toHaveLength(2);
  });
});
