import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@kimak/tailwind/theme.css": path.resolve(
        __dirname,
        "../../packages/tailwind/src/theme.css",
      ),
      "@kimak/headless-react": path.resolve(
        __dirname,
        "../../packages/headless/react/src/index.ts",
      ),
      "@kimak/ui-react": path.resolve(__dirname, "../../packages/ui/react/src/index.ts"),
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
    port: 5173,
  },
});

