import path from "path";
import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    reporters: ["json", "default"],
    outputFile: "./test-output.json",
    coverage: {
      include: ["frontend"],
      exclude: [
        "frontend/model",
        "frontend/tests/*",
        "**/*.stories.tsx",
        "**/*.test.*",
        "frontend/mocks/**",
        "frontend/utils/models",
        "**/model/*",
        "frontend/main.tsx",
      ],
    },
    environment: "jsdom",
    setupFiles: "./frontend/tests/setup.tsx",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./frontend"),
    },
  },
});
