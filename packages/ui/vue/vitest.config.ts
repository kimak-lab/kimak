import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@kimak/headless-vue": path.resolve(__dirname, "../../headless/vue/src/index.ts"),
    },
  },
  test: {
    name: "ui-vue",
    include: ["src/**/*.test.ts"],
  },
});
