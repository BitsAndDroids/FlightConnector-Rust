import { describe, expect, test, vi } from "vitest";
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

  test("OnClick sends object", () => {
    const onClick = vi.fn();
    const { getByText } = render(
      <Row
        id={""}
        name={"test"}
        object={{}}
        onClick={onClick}
        onDelete={function (toDelete: any): void {
          throw new Error("Function not implemented.");
        }}
        onEdit={function (toEdit: any): void {
          throw new Error("Function not implemented.");
        }}
      />,
    );
    getByText("test").click();
    expect(onClick).toHaveBeenCalled();
  });

  test("OnClick trashIcon sends object", () => {
    const onDelete = vi.fn();
    const { getByTestId } = render(
      <Row
        id={""}
        name={""}
        object={{}}
        onClick={function (set: any): void {
          throw new Error("Function not implemented.");
        }}
        onDelete={onDelete}
        onEdit={function (toEdit: any): void {
          throw new Error("Function not implemented.");
        }}
      />,
    );
    getByTestId("ico_delete").click();
    expect(onDelete).toHaveBeenCalled();
  });

  test("OnClick editIcon sends object", () => {
    const onEdit = vi.fn();
    const { getByTestId } = render(
      <Row
        id={""}
        name={""}
        object={{}}
        onClick={function (set: any): void {}}
        onDelete={function (toDelete: any): void {}}
        onEdit={onEdit}
      />,
    );
    getByTestId("ico_edit").click();
    expect(onEdit).toHaveBeenCalled();
  });
});
