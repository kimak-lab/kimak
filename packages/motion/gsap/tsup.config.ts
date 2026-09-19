import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/button/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
  external: ["gsap", "@kimak/spec"],
});
