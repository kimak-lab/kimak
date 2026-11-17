import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        runes: true,
      },
    }),
  ],
  resolve: {
    conditions: ["browser"],
    alias: {
      "@kimak/headless-svelte": path.resolve(__dirname, "../../headless/svelte/src/index.ts"),
      "@kimak/core": path.resolve(__dirname, "../../core/src/index.ts"),
      "@kimak/spec": path.resolve(__dirname, "../../spec/src/index.ts"),
    },
  },
  test: {
    name: "ui-svelte",
    environment: "jsdom",
    setupFiles: ["./src/setup.ts"],
    include: ["src/**/*.test.ts"],
  },
});
