import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    button: "src/button/index.ts",
    spinner: "src/spinner/index.ts",
    "button-group": "src/button-group/index.ts",
  },
  format: ["esm"],
  dts: { compilerOptions: { ignoreDeprecations: "6.0" } },
  clean: true,
  sourcemap: true,
  treeshake: true,
  splitting: false,
  external: ["vue", "@kimak/headless-vue", "@kimak/motion-gsap", "gsap"],
});
