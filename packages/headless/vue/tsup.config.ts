import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/button/index.ts", "src/checkbox/index.ts", "src/dialog/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
  splitting: false,
  external: ["vue", "@kimak/core", "@kimak/spec"],
});
