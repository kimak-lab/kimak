import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      "@kimak/tailwind/theme.css": path.resolve(
        __dirname,
        "../../packages/tailwind/src/theme.css",
      ),
      "@kimak/headless-vue": path.resolve(
        __dirname,
        "../../packages/headless/vue/src/index.ts",
      ),
      "@kimak/ui-vue": path.resolve(__dirname, "../../packages/ui/vue/src/index.ts"),
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
    port: 5174,
  },
});
