import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [svelte(), tailwindcss()],
  resolve: {
    alias: {
      "@kimak/tailwind/theme.css": path.resolve(
        __dirname,
        "../../packages/tailwind/src/theme.css",
      ),
      "@kimak/headless-svelte": path.resolve(
        __dirname,
        "../../packages/headless/svelte/src/index.ts",
      ),
      "@kimak/ui-svelte": path.resolve(__dirname, "../../packages/ui/svelte/src/index.ts"),
      "@kimak/core": path.resolve(__dirname, "../../packages/core/src/index.ts"),
      "@kimak/spec": path.resolve(__dirname, "../../packages/spec/src/index.ts"),
      "@kimak/tailwind": path.resolve(__dirname, "../../packages/tailwind/src/index.ts"),
      "@kimak/motion-gsap": path.resolve(
        __dirname,
        "../../packages/motion/gsap/src/index.ts",
      ),
    },
  },
  server: {
    port: 5175,
  },
});
