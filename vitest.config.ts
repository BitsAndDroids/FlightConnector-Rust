import path from "path";
import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    coverage: {
      include: ["src"],
      exclude: ["src/model", "**/*.stories.tsx", "**/*.test.*"],
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
