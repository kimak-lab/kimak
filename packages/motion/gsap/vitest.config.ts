import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@kimak/spec": path.resolve(__dirname, "../../spec/src/index.ts"),
    },
  },
  test: {
    name: "motion-gsap",
    environment: "jsdom",
    setupFiles: ["./src/setup.ts"],
    include: ["src/**/*.test.ts"],
  },
});
