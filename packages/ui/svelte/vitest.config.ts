import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@kimak/headless-svelte": path.resolve(__dirname, "../../headless/svelte/src/index.ts"),
      "@kimak/spec": path.resolve(__dirname, "../../spec/src/index.ts"),
    },
  },
  test: {
    name: "ui-svelte",
    include: ["src/**/*.test.ts"],
  },
});
