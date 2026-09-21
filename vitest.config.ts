import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      "packages/spec",
      "packages/core",
      "packages/headless/react",
      "packages/headless/vue",
      "packages/headless/svelte",
      "packages/ui/react",
      "packages/ui/vue",
      "packages/ui/svelte",
      "packages/tailwind",
    ],
  },
});
