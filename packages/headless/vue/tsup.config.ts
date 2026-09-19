import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/button/index.ts"],
  format: ["esm"],
  dts: { compilerOptions: { ignoreDeprecations: "6.0" } },
  clean: true,
  sourcemap: true,
  treeshake: true,
  splitting: false,
  external: ["vue", "@kimak/core", "@kimak/spec"],
});
