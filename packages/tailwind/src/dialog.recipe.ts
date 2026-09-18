// Deep import: jiti's plugin loader drops named re-exports from the @kimak/spec barrel.
import { dialogAnatomy } from "../../spec/src/dialog/dialog.anatomy";
import { buttonChrome } from "./button.recipe";
import { focusRing, mix, t } from "./theme";
import type { CssInJs } from "./types";

const sizes = ["sm", "md", "lg"] as const;
type Size = (typeof sizes)[number];

function assertNever(value: never): never {
  throw new Error(`Unhandled dialog size: ${String(value)}`);
}

function contentWidth(size: Size): string {
  switch (size) {
    case "sm":
      return "min(20rem, 100%)";
    case "md":
      return "min(32rem, calc(100% - 2rem))";
    case "lg":
      return "min(36rem, calc(100% - 2rem))";
    default:
      return assertNever(size);
  }
}

export function dialogRecipe(): CssInJs {
  const trigger = dialogAnatomy.trigger.selector;
  const close = dialogAnatomy.close.selector;
  const backdrop = dialogAnatomy.backdrop.selector;
  const positioner = dialogAnatomy.positioner.selector;
  const content = dialogAnatomy.content.selector;
  const title = dialogAnatomy.title.selector;
  const description = dialogAnatomy.description.selector;
  const chrome = buttonChrome();

  const recipe: CssInJs = {
    [trigger]: chrome,
    [close]: chrome,
    [`${trigger}:hover, ${close}:hover`]: {
      backgroundColor: mix(t.primary, 90),
    },
    [`${trigger}[data-disabled]`]: {
      pointerEvents: "none",
      opacity: "0.5",
    },
    [`${trigger}:focus-visible, ${close}:focus-visible`]: focusRing(),
    [backdrop]: {
      position: "fixed",
      inset: "0",
      backgroundColor: "rgb(0 0 0 / 0.5)",
    },
    [`${backdrop}[data-state="open"], ${content}[data-state="open"]`]: {
      pointerEvents: "auto",
    },
    [`${backdrop}[data-state="closed"], ${content}[data-state="closed"]`]: {
      pointerEvents: "none",
    },
    [positioner]: {
      position: "fixed",
      inset: "0",
      display: "grid",
      placeItems: "center",
      padding: "1rem",
    },
    [content]: {
      boxSizing: "border-box",
      width: contentWidth("md"),
      backgroundColor: t.background,
      color: t.foreground,
      border: `1px solid ${t.border}`,
      borderRadius: t.radiusLg,
      padding: "1.5rem",
      boxShadow:
        "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    },
    [`${content}:focus`]: {
      outline: "none",
    },
    [`${content}:focus-visible`]: focusRing(),
    [title]: {
      margin: "0 0 0.4rem",
      fontSize: "1.125rem",
      fontWeight: "600",
      lineHeight: "1.25",
    },
    [description]: {
      margin: "0 0 1rem",
      fontSize: "0.875rem",
      color: t.mutedForeground,
    },
  };

  for (const size of sizes) {
    recipe[`${content}[data-size="${size}"]`] = { width: contentWidth(size) };
  }

  return recipe;
}
