import { readFileSync, writeFileSync } from "node:fs";
import { defineConfig } from "tsup";

const entries = ["dist/index.js", "dist/button.js"];

export default defineConfig({
  entry: {
    index: "src/index.ts",
    button: "src/button/index.ts",
  },
  format: ["esm"],
  dts: true,
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
