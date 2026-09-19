import { readFileSync, writeFileSync } from "node:fs";
import { defineConfig } from "tsup";

const entries = ["dist/index.js", "dist/button.js", "dist/spinner.js", "dist/button-group.js"];

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
  external: ["react", "react-dom", "@kimak/headless-react", "@kimak/motion-gsap", "gsap"],
  async onSuccess() {
    for (const file of entries) {
      const code = readFileSync(file, "utf8");
      if (!code.startsWith('"use client"')) {
        writeFileSync(file, `"use client";\n${code}`);
      }
    }
  },
});
