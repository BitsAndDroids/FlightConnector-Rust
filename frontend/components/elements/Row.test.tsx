import { describe, expect, test } from "vitest";
import { Row } from "./Row";
import { render } from "@testing-library/react";

describe("Row", () => {
  test("renders without crashing", () => {
    const { container } = render(
      <Row
        id={""}
        name={""}
        object={undefined}
        onClick={function (set: any): void {
          throw new Error("Function not implemented.");
        }}
        onDelete={function (toDelete: any): void {
          throw new Error("Function not implemented.");
        }}
        onEdit={function (toEdit: any): void {
          throw new Error("Function not implemented.");
        }}
      />,
    );
    expect(container).toBeTruthy();
  });

  test("renders trashIcon", () => {
    const { getByTestId } = render(
      <Row
        id={""}
        name={""}
        object={undefined}
        onClick={function (set: any): void {
          throw new Error("Function not implemented.");
        }}
        onDelete={function (toDelete: any): void {
          throw new Error("Function not implemented.");
        }}
        onEdit={function (toEdit: any): void {
          throw new Error("Function not implemented.");
        }}
      />,
    );
    expect(getByTestId("ico_delete")).toBeTruthy();
  });

  test("renders editIcon", () => {
    const { getByTestId } = render(
      <Row
        id={""}
        name={""}
        object={undefined}
        onClick={function (set: any): void {
          throw new Error("Function not implemented.");
        }}
        onDelete={function (toDelete: any): void {
          throw new Error("Function not implemented.");
        }}
        onEdit={function (toEdit: any): void {
          throw new Error("Function not implemented.");
        }}
      />,
    );
    expect(getByTestId("ico_edit")).toBeTruthy();
  });
});
