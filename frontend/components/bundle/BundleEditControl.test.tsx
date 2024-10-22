import { describe, expect, test, vi } from "vitest";
import BundleEditControls from "./BundleEditControls";
import { render } from "@testing-library/react";

describe("BundleEditControl", async () => {
  test("renders without crashing", async () => {
    const { container } = render(
      <BundleEditControls
        saveBundle={function (): void {
          throw new Error("Function not implemented.");
        }}
      />,
    );
    expect(container).toBeTruthy();
  });
  test("excecutes saveBundle function on click", async () => {
    const saveBundle = vi.fn();
    const { getByTestId } = render(
      <BundleEditControls saveBundle={saveBundle} />,
    );
    getByTestId("btn-save-bundle").click();
    expect(saveBundle).toHaveBeenCalled();
  });
});
