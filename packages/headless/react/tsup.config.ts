import { readFileSync, writeFileSync } from "node:fs";
import { defineConfig } from "tsup";

const entries = ["dist/index.js", "dist/button/index.js"];

export default defineConfig({
  entry: ["src/index.ts", "src/button/index.ts"],
  format: ["esm"],
  dts: { compilerOptions: { ignoreDeprecations: "6.0" } },
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
