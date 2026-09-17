import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@kimak/react": path.resolve(__dirname, "../../packages/react/src/index.ts"),
      "@kimak/core": path.resolve(__dirname, "../../packages/core/src/index.ts"),
      "@kimak/spec": path.resolve(__dirname, "../../packages/spec/src/index.ts"),
    },
  },
  server: {
    port: 5173,
  },
});
