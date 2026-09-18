// Deep import: jiti's plugin loader drops named re-exports from the @kimak/spec barrel.
import { buttonAnatomy } from "../../spec/src/button/button.anatomy";
import { focusRing, mix, t } from "./theme";
import type { CssInJs } from "./types";

const sizes = ["sm", "md", "lg"] as const;
type Size = (typeof sizes)[number];

const variants = ["default", "secondary", "outline", "ghost", "destructive"] as const;
type Variant = (typeof variants)[number];

function assertNever(value: never): never {
  throw new Error(`Unhandled button look: ${String(value)}`);
}

function sizeLook(size: Size): CssInJs {
  switch (size) {
    case "sm":
      return { height: "2rem", padding: "0 0.75rem", gap: "0.375rem", fontSize: "0.875rem" };
    case "md":
      return { height: "2.25rem", padding: "0.5rem 1rem", gap: "0.5rem", fontSize: "0.875rem" };
    case "lg":
      return { height: "2.5rem", padding: "0 1.5rem", gap: "0.5rem", fontSize: "0.875rem" };
    default:
      return assertNever(size);
  }
}

function spinnerBox(size: Size): CssInJs {
  switch (size) {
    case "sm":
      return { width: "0.75rem", height: "0.75rem" };
    case "md":
      return { width: "1rem", height: "1rem" };
    case "lg":
      return { width: "1.05rem", height: "1.05rem" };
    default:
      return assertNever(size);
  }
}

function variantLook(variant: Variant): CssInJs {
  switch (variant) {
    case "default":
      return {
        backgroundColor: t.primary,
        color: t.primaryForeground,
        borderColor: "transparent",
      };
    case "secondary":
      return {
        backgroundColor: t.secondary,
        color: t.secondaryForeground,
        borderColor: "transparent",
      };
    case "outline":
      return {
        backgroundColor: t.background,
        color: t.foreground,
        borderColor: t.border,
        boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      };
    case "ghost":
      return {
        backgroundColor: "transparent",
        color: t.foreground,
        borderColor: "transparent",
      };
    case "destructive":
      return {
        backgroundColor: t.destructive,
        color: "white",
        borderColor: "transparent",
      };
    default:
      return assertNever(variant);
  }
}

function variantHover(variant: Variant): CssInJs {
  switch (variant) {
    case "default":
      return { backgroundColor: mix(t.primary, 90) };
    case "secondary":
      return { backgroundColor: mix(t.secondary, 80) };
    case "outline":
      return { backgroundColor: t.accent, color: t.accentForeground };
    case "ghost":
      return { backgroundColor: t.accent, color: t.accentForeground };
    case "destructive":
      return { backgroundColor: mix(t.destructive, 90) };
    default:
      return assertNever(variant);
  }
}

function glyphMask(path: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="none" stroke="black" stroke-width="1.75" d="${path}"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") center / contain no-repeat`;
}

export function buttonChrome(): CssInJs {
  return {
    boxSizing: "border-box",
    position: "relative",
    display: "inline-flex",
    flexShrink: "0",
    alignItems: "center",
    justifyContent: "center",
    whiteSpace: "nowrap",
    font: "inherit",
    fontWeight: "500",
    lineHeight: "1.25",
    borderRadius: t.radiusMd,
    borderWidth: "1px",
    borderStyle: "solid",
    transition: "color 150ms, background-color 150ms, box-shadow 150ms, border-color 150ms",
    cursor: "default",
    ...sizeLook("md"),
    ...variantLook("default"),
  };
}

export function buttonRecipe(): CssInJs {
  const root = buttonAnatomy.root.selector;
  const indicator = buttonAnatomy.indicator.selector;
  const spinner = glyphMask("M8 2.5a5.5 5.5 0 1 1-3.89 1.61");

  const recipe: CssInJs = {
    [root]: buttonChrome(),
    [`${root}:hover`]: variantHover("default"),
    [`${root}[data-disabled], ${root}[data-loading]`]: {
      pointerEvents: "none",
      opacity: "0.5",
    },
    [`${root}:focus-visible`]: focusRing(),
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

  for (const variant of variants) {
    recipe[`${root}[data-variant="${variant}"]`] = variantLook(variant);
    recipe[`${root}[data-variant="${variant}"]:hover`] = variantHover(variant);
  }

  recipe[`.dark ${root}[data-variant="destructive"]`] = {
    backgroundColor: mix(t.destructive, 60),
  };
  recipe[`.dark ${root}[data-variant="outline"]`] = {
    borderColor: t.input,
    backgroundColor: mix(t.input, 30),
  };
  recipe[`.dark ${root}[data-variant="outline"]:hover`] = {
    backgroundColor: mix(t.input, 50),
  };
  recipe[`.dark ${root}[data-variant="ghost"]:hover`] = {
    backgroundColor: mix(t.accent, 50),
  };

  for (const size of sizes) {
    recipe[`${root}[data-size="${size}"]`] = sizeLook(size);
    recipe[`${root}[data-size="${size}"] ${indicator}`] = spinnerBox(size);
  }

  return recipe;
}
