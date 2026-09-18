// Deep import: jiti's plugin loader drops named re-exports from the @kimak/spec barrel.
import { checkboxAnatomy } from "../../spec/src/checkbox/checkbox.anatomy";
import { focusRing, mix, t } from "./theme";
import type { CssInJs } from "./types";

const sizes = ["sm", "md", "lg"] as const;
type Size = (typeof sizes)[number];

function assertNever(value: never): never {
  throw new Error(`Unhandled checkbox size: ${String(value)}`);
}

function controlBox(size: Size): CssInJs {
  switch (size) {
    case "sm":
      return { width: "0.875rem", height: "0.875rem" };
    case "md":
      return { width: "1rem", height: "1rem" };
    case "lg":
      return { width: "1.25rem", height: "1.25rem" };
    default:
      return assertNever(size);
  }
}

function indicatorBox(size: Size): CssInJs {
  switch (size) {
    case "sm":
      return { width: "0.65rem", height: "0.65rem" };
    case "md":
      return { width: "0.75rem", height: "0.75rem" };
    case "lg":
      return { width: "0.95rem", height: "0.95rem" };
    default:
      return assertNever(size);
  }
}

function rootGap(size: Size): string {
  switch (size) {
    case "sm":
      return "0.45rem";
    case "md":
      return "0.5rem";
    case "lg":
      return "0.65rem";
    default:
      return assertNever(size);
  }
}

function glyphMask(path: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="none" stroke="black" stroke-width="1.75" d="${path}"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") center / contain no-repeat`;
}

function emptyGlyph(mask: string): CssInJs {
  return {
    content: '""',
    display: "block",
    width: "100%",
    height: "100%",
    backgroundColor: "currentColor",
    mask: mask,
    WebkitMask: mask,
  };
}

export function checkboxRecipe(): CssInJs {
  const root = checkboxAnatomy.root.selector;
  const control = checkboxAnatomy.control.selector;
  const indicator = checkboxAnatomy.indicator.selector;
  const label = checkboxAnatomy.label.selector;
  const check = glyphMask("M3.5 8.5 6.5 11.5 12.5 4.5");
  const dash = glyphMask("M3.5 8h9");

  const recipe: CssInJs = {
    [root]: {
      display: "inline-flex",
      alignItems: "center",
      gap: rootGap("md"),
      cursor: "pointer",
      color: t.foreground,
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
      border: `1px solid ${t.input}`,
      borderRadius: "4px",
      display: "grid",
      placeItems: "center",
      backgroundColor: t.background,
      color: t.primaryForeground,
      flexShrink: "0",
      boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      transition: "color 150ms, background-color 150ms, box-shadow 150ms, border-color 150ms",
    },
    [`${root}[data-state="checked"] ${control}, ${root}[data-state="indeterminate"] ${control}, ${control}[data-state="checked"], ${control}[data-state="indeterminate"]`]:
      {
        backgroundColor: t.primary,
        borderColor: t.primary,
        color: t.primaryForeground,
      },
    [`${root}[data-invalid] ${control}, ${control}[data-invalid]`]: {
      borderColor: t.destructive,
      boxShadow: `0 0 0 3px ${mix(t.destructive, 20)}`,
    },
    [`${control}:focus-visible`]: focusRing(),
    [indicator]: {
      display: "none",
      ...indicatorBox("md"),
    },
    [`${indicator}[data-state="checked"], ${indicator}[data-state="indeterminate"]`]: {
      display: "block",
    },
    [`${indicator}[data-state="checked"]:empty::after`]: emptyGlyph(check),
    [`${indicator}[data-state="indeterminate"]:empty::after`]: emptyGlyph(dash),
  };

  for (const size of sizes) {
    recipe[`${root}[data-size="${size}"]`] = { gap: rootGap(size) };
    recipe[`${root}[data-size="${size}"] ${control}`] = controlBox(size);
    recipe[`${root}[data-size="${size}"] ${indicator}`] = indicatorBox(size);
  }

  return recipe;
}
