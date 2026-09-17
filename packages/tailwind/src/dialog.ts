import { dialogAnatomy } from "@kimak/spec";
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
      return "min(24rem, 100%)";
    case "lg":
      return "min(36rem, 100%)";
    default:
      return assertNever(size);
  }
}

function buttonLook(): CssInJs {
  return {
    font: "inherit",
    padding: "0.4rem 0.75rem",
    border: "1px solid var(--color-kimak-border)",
    backgroundColor: "var(--color-kimak-bg)",
    color: "var(--color-kimak-fg)",
    cursor: "pointer",
  };
}

export function dialogRecipe(): CssInJs {
  const trigger = dialogAnatomy.trigger.selector;
  const close = dialogAnatomy.close.selector;
  const backdrop = dialogAnatomy.backdrop.selector;
  const positioner = dialogAnatomy.positioner.selector;
  const content = dialogAnatomy.content.selector;
  const title = dialogAnatomy.title.selector;
  const description = dialogAnatomy.description.selector;

  const recipe: CssInJs = {
    [trigger]: buttonLook(),
    [close]: buttonLook(),
    [`${trigger}[data-disabled]`]: {
      cursor: "not-allowed",
      opacity: "0.5",
    },
    [`${trigger}:focus-visible, ${close}:focus-visible`]: {
      outline: "2px solid var(--color-kimak-ring)",
      outlineOffset: "3px",
    },
    [backdrop]: {
      position: "fixed",
      inset: "0",
      backgroundColor: "var(--color-kimak-backdrop)",
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
      backgroundColor: "var(--color-kimak-bg)",
      color: "var(--color-kimak-fg)",
      border: "1px solid var(--color-kimak-border)",
      padding: "1.25rem",
    },
    [`${content}:focus`]: {
      outline: "none",
    },
    [`${content}:focus-visible`]: {
      outline: "2px solid var(--color-kimak-ring)",
      outlineOffset: "3px",
    },
    [title]: {
      margin: "0 0 0.4rem",
      fontSize: "1.15rem",
    },
    [description]: {
      margin: "0 0 1rem",
    },
  };

  for (const size of sizes) {
    recipe[`${content}[data-size="${size}"]`] = { width: contentWidth(size) };
  }

  return recipe;
}
