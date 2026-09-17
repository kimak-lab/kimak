import type { CssInJs } from "./types";

export const themeBase: CssInJs = {
  ":root": {
    "--color-kimak-fg": "CanvasText",
    "--color-kimak-bg": "Canvas",
    "--color-kimak-accent": "CanvasText",
    "--color-kimak-border": "currentColor",
    "--color-kimak-ring": "currentColor",
    "--color-kimak-danger": "color-mix(in srgb, CanvasText 70%, red)",
    "--color-kimak-backdrop": "color-mix(in srgb, CanvasText 35%, transparent)",
  },
};
