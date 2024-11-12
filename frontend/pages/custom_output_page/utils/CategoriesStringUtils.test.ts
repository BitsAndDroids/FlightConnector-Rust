import { describe, test, expect } from "vitest";
import {
  checkLastCharOfCategories,
  parseCategories,
  stringifyCategories,
} from "./CategoriesStringUtils";

describe("CategoriesStringUtils", () => {
  test("should return an empty string when the input is an empty array", () => {
    expect(stringifyCategories([])).toBe("");
  });
  test("Should return a string with the categories separated by commas", () => {
    expect(stringifyCategories(["a", "b", "c"])).toBe("a, b, c");
  });
  test("Should return categories based on the input string", () => {
    expect(parseCategories("a, b, c")).toEqual(["a", "b", "c"]);
  });
  test("Should return wether the last character is a comma", () => {
    expect(checkLastCharOfCategories("a, b, c,")).toBe(true);
  });
  test("Should add a space after the last comma", () => {
    expect(parseCategories("a, b, c,")).toEqual(["a", "b", "c", ""]);
  });
});
