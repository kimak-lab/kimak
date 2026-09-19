import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: { compilerOptions: { ignoreDeprecations: "6.0" } },
  clean: true,
  sourcemap: true,
  treeshake: true,
  external: ["tailwindcss", "tailwindcss/plugin", "@kimak/spec"],
});
