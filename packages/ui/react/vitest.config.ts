import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@kimak/headless-react": path.resolve(__dirname, "../../headless/react/src/index.ts"),
      "@kimak/core": path.resolve(__dirname, "../../core/src/index.ts"),
      "@kimak/spec": path.resolve(__dirname, "../../spec/src/index.ts"),
    },
  },
  test: {
    name: "ui-react",
    environment: "jsdom",
    setupFiles: ["./src/setup.ts"],
    include: ["src/**/*.test.tsx"],
  },
});
