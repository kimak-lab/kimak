import { vitePreprocess } from "@astrojs/svelte";

export default {
  preprocess: vitePreprocess(),
  vitePlugin: {
    // Runes for our own components only. Some icon packages (svelte-remixicon)
    // still ship legacy syntax, so node_modules keep Svelte's per-file detection.
    dynamicCompileOptions({ filename }) {
      if (!filename.includes("/node_modules/")) return { runes: true };
      return undefined;
    },
  },
};
