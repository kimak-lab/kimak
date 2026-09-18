import { buttonAnatomy } from "@kimak/spec";
import type { CssInJs } from "./types";

const sizes = ["sm", "md", "lg"] as const;
type Size = (typeof sizes)[number];

function assertNever(value: never): never {
  throw new Error(`Unhandled button size: ${String(value)}`);
}

function rootPadding(size: Size): string {
  switch (size) {
    case "sm":
      return "0.25rem 0.6rem";
    case "md":
      return "0.4rem 0.75rem";
    case "lg":
      return "0.55rem 0.95rem";
    default:
      return assertNever(size);
  }
}

function rootFontSize(size: Size): string {
  switch (size) {
    case "sm":
      return "0.85rem";
    case "md":
      return "0.95rem";
    case "lg":
      return "1.05rem";
    default:
      return assertNever(size);
  }
}

function spinnerBox(size: Size): CssInJs {
  switch (size) {
    case "sm":
      return { width: "0.75rem", height: "0.75rem" };
    case "md":
      return { width: "0.9rem", height: "0.9rem" };
    case "lg":
      return { width: "1.05rem", height: "1.05rem" };
    default:
      return assertNever(size);
  }
}

function glyphMask(path: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="none" stroke="black" stroke-width="1.75" d="${path}"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") center / contain no-repeat`;
}

export function buttonRecipe(): CssInJs {
  const root = buttonAnatomy.root.selector;
  const indicator = buttonAnatomy.indicator.selector;
  const spinner = glyphMask("M8 2.5a5.5 5.5 0 1 1-3.89 1.61");

  const recipe: CssInJs = {
    [root]: {
      boxSizing: "border-box",
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.4rem",
      font: "inherit",
      fontSize: rootFontSize("md"),
      lineHeight: "1.2",
      padding: rootPadding("md"),
      border: "1px solid var(--color-kimak-border)",
      backgroundColor: "var(--color-kimak-bg)",
      color: "var(--color-kimak-fg)",
      cursor: "pointer",
    },
    [`${root}[data-disabled], ${root}[data-loading]`]: {
      cursor: "not-allowed",
      opacity: "0.5",
    },
    [`${root}:focus-visible`]: {
      outline: "2px solid var(--color-kimak-ring)",
      outlineOffset: "3px",
    },
    [indicator]: {
      display: "none",
      ...spinnerBox("md"),
      flexShrink: "0",
    },
    [`${root}[data-loading] ${indicator}, ${indicator}[data-loading]`]: {
      display: "block",
    },
    [`${indicator}:empty::after`]: {
      content: '""',
      display: "block",
      width: "100%",
      height: "100%",
      backgroundColor: "currentColor",
      mask: spinner,
      WebkitMask: spinner,
    },
  };

  for (const size of sizes) {
    recipe[`${root}[data-size="${size}"]`] = {
      padding: rootPadding(size),
      fontSize: rootFontSize(size),
    };
    recipe[`${root}[data-size="${size}"] ${indicator}`] = spinnerBox(size);
  }

  return recipe;
}
