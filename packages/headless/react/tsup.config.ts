import { readFileSync, writeFileSync } from "node:fs";
import { defineConfig } from "tsup";

const entries = ["dist/index.js", "dist/checkbox/index.js", "dist/dialog/index.js"];

export default defineConfig({
  entry: ["src/index.ts", "src/checkbox/index.ts", "src/dialog/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
  splitting: false,
  async onSuccess() {
    for (const file of entries) {
      const code = readFileSync(file, "utf8");
      if (!code.startsWith('"use client"')) {
        writeFileSync(file, `"use client";\n${code}`);
      }
    }
  },
});
