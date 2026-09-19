import type { CssInJs } from "./types";

export function spinKeyframes(): CssInJs {
  return {
    "@keyframes kimak-button-spin": {
      to: { transform: "rotate(360deg)" },
    },
  };
}

export function spinnerGlyph(box: CssInJs): CssInJs {
  return {
    display: "inline-block",
    boxSizing: "border-box",
    ...box,
    flexShrink: "0",
    borderWidth: "2px",
    borderStyle: "solid",
    borderColor: "currentColor",
    borderRightColor: "transparent",
    borderRadius: "50%",
    animation: "kimak-button-spin 0.65s linear infinite",
  };
}
