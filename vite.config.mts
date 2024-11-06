import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(async () => ({
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
  plugins: [react()],
  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  resolve: {
    alias: {
      // 4. tell vite to use the `src-tauri` directory
      "@": path.resolve(__dirname, "./frontend"),
    },
  },
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
}));
