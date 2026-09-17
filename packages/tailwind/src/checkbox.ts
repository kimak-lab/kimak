import { checkboxAnatomy } from "@kimak/spec";
import type { CssInJs } from "./types";

const sizes = ["sm", "md", "lg"] as const;
type Size = (typeof sizes)[number];

function assertNever(value: never): never {
  throw new Error(`Unhandled checkbox size: ${String(value)}`);
}

function controlBox(size: Size): CssInJs {
  switch (size) {
    case "sm":
      return { width: "0.9rem", height: "0.9rem" };
    case "md":
      return { width: "1.15rem", height: "1.15rem" };
    case "lg":
      return { width: "1.4rem", height: "1.4rem" };
    default:
      return assertNever(size);
  }
}

function indicatorBox(size: Size): CssInJs {
  switch (size) {
    case "sm":
      return { width: "0.65rem", height: "0.65rem" };
    case "md":
      return { width: "0.85rem", height: "0.85rem" };
    case "lg":
      return { width: "1.05rem", height: "1.05rem" };
    default:
      return assertNever(size);
  }
}

function rootGap(size: Size): string {
  switch (size) {
    case "sm":
      return "0.45rem";
    case "md":
      return "0.6rem";
    case "lg":
      return "0.75rem";
    default:
      return assertNever(size);
  }
}

export function checkboxRecipe(): CssInJs {
  const root = checkboxAnatomy.root.selector;
  const control = checkboxAnatomy.control.selector;
  const indicator = checkboxAnatomy.indicator.selector;
  const label = checkboxAnatomy.label.selector;

  const recipe: CssInJs = {
    [root]: {
      display: "inline-flex",
      alignItems: "center",
      gap: rootGap("md"),
      cursor: "pointer",
      color: "var(--color-kimak-fg)",
    },
    [`${root}[data-disabled]`]: {
      cursor: "not-allowed",
      opacity: "0.5",
    },
    [label]: {
      color: "inherit",
    },
    [control]: {
      boxSizing: "border-box",
      ...controlBox("md"),
      border: "1.5px solid var(--color-kimak-border)",
      display: "grid",
      placeItems: "center",
      backgroundColor: "var(--color-kimak-bg)",
      flexShrink: "0",
    },
    [`${root}[data-invalid] ${control}, ${control}[data-invalid]`]: {
      borderColor: "var(--color-kimak-danger)",
    },
    [`${control}:focus-visible`]: {
      outline: "2px solid var(--color-kimak-ring)",
      outlineOffset: "3px",
    },
    [indicator]: {
      display: "none",
      ...indicatorBox("md"),
    },
    [`${indicator}[data-state="checked"], ${indicator}[data-state="indeterminate"]`]: {
      display: "block",
    },
  };

  for (const size of sizes) {
    recipe[`${root}[data-size="${size}"]`] = { gap: rootGap(size) };
    recipe[`${root}[data-size="${size}"] ${control}`] = controlBox(size);
    recipe[`${root}[data-size="${size}"] ${indicator}`] = indicatorBox(size);
  }

  return recipe;
}
