import type { Config } from "@jest/types";
export default async (): Promise<Config.InitialOptions> => {
  return {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    roots: ["src"],
    globals: {
      "ts-jest": {
        tsconfig: "tsconfig.json",
      },
    },
  };
};
