import { describe, test, expect } from "vitest";
import Layout from "./layout";
import { render } from "@testing-library/react";

describe("layout", () => {
  test("renders without crashing", () => {
    const { container } = render(
      <Layout>
        {
          <div>
            <h1>HALLO</h1>
          </div>
        }
      </Layout>,
    );
    expect(container).toBeTruthy();
  });
});
