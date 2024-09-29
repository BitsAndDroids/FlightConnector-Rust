import path from "path";
import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    coverage: {
      include: ["src"],
      exclude: [
        "src/model",
        "src/tests/*",
        "**/*.stories.tsx",
        "**/*.test.*",
        "mocks/**",
        "src/utils/models",
        "**/model/*",
        "src/main.tsx",
      ],
    },
    environment: "jsdom",
    setupFiles: "./src/tests/setup.tsx",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
