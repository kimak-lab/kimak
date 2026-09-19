import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const here = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@kimak/spec": path.resolve(here, "../spec/src/index.ts"),
    },
  },
  test: {
    name: "tailwind",
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
