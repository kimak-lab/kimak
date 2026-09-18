import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      "packages/spec",
      "packages/core",
      "packages/headless/react",
      "packages/ui/react",
      "packages/tailwind",
    ],
  },
});
