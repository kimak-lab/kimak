import vue from "@vitejs/plugin-vue";
import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@kimak/core": path.resolve(__dirname, "../../core/src/index.ts"),
      "@kimak/spec": path.resolve(__dirname, "../../spec/src/index.ts"),
    },
  },
  test: {
    name: "headless-vue",
    environment: "jsdom",
    setupFiles: ["./src/setup.ts"],
    include: ["src/**/*.test.ts"],
  },
});
