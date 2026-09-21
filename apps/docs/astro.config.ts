import path from "node:path";
import { fileURLToPath } from "node:url";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import svelte from "@astrojs/svelte";
import vue from "@astrojs/vue";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { docsShikiThemes } from "./src/lib/shiki";

const repoRoot = path.resolve(fileURLToPath(new URL(".", import.meta.url)), "../..");
const pkg = (...segments: string[]) => path.join(repoRoot, "packages", ...segments);

export default defineConfig({
  output: "static",
  markdown: {
    shikiConfig: {
      themes: docsShikiThemes,
    },
  },
  integrations: [
    react({
      include: ["**/demos/**/*.tsx", "**/components/**/*.tsx"],
    }),
    vue(),
    svelte(),
    mdx(),
  ],
  server: {
    port: 5176,
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@kimak/tailwind/theme.css": pkg("tailwind/src/theme.css"),
        "@kimak/headless-react": pkg("headless/react/src/index.ts"),
        "@kimak/headless-vue": pkg("headless/vue/src/index.ts"),
        "@kimak/headless-svelte": pkg("headless/svelte/src/index.ts"),
        "@kimak/ui-react": pkg("ui/react/src/index.ts"),
        "@kimak/ui-vue": pkg("ui/vue/src/index.ts"),
        "@kimak/ui-svelte": pkg("ui/svelte/src/index.ts"),
        "@kimak/core": pkg("core/src/index.ts"),
        "@kimak/spec": pkg("spec/src/index.ts"),
        "@kimak/tailwind": pkg("tailwind/src/index.ts"),
      },
    },
    ssr: {
      noExternal: [/^@kimak\//],
    },
    optimizeDeps: {
      exclude: [
        "@kimak/ui-react",
        "@kimak/ui-vue",
        "@kimak/ui-svelte",
        "@kimak/headless-react",
        "@kimak/headless-vue",
        "@kimak/headless-svelte",
        "@kimak/core",
        "@kimak/spec",
      ],
    },
  },
});
