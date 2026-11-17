// Deep import: jiti's plugin loader drops named re-exports from the @kimak/spec barrel.
import { popoverAnatomy } from "../../spec/src/popover/popover.anatomy";
import { mix, t } from "./theme";
import type { CssInJs } from "./types";

const sides = ["top", "right", "bottom", "left"] as const;
type Side = (typeof sides)[number];

function assertNever(value: never): never {
  throw new Error(`Unhandled popover side: ${String(value)}`);
}

/** Content slides in from the trigger, so the offset points away from the side. */
function enterOffset(side: Side): string {
  switch (side) {
    case "top":
      return "0, 0.25rem";
    case "right":
      return "-0.25rem, 0";
    case "bottom":
      return "0, -0.25rem";
    case "left":
      return "0.25rem, 0";
    default:
      return assertNever(side);
  }
}

export function popoverRecipe(): CssInJs {
  const positioner = popoverAnatomy.positioner.selector;
  const content = popoverAnatomy.content.selector;
  const title = popoverAnatomy.title.selector;
  const description = popoverAnatomy.description.selector;

  const motion: CssInJs = {
    [`${content}[data-state="open"]`]: {
      animation: "kimak-popover-in 150ms ease-out",
    },
  };
  for (const side of sides) {
    motion[`${content}[data-side="${side}"]`] = {
      "--kimak-popover-enter": enterOffset(side),
    };
  }

  return {
    "@keyframes kimak-popover-in": {
      from: {
        opacity: "0",
        transform: "translate(var(--kimak-popover-enter, 0, 0)) scale(0.96)",
      },
    },
    [positioner]: {
      zIndex: "50",
    },
    [content]: {
      boxSizing: "border-box",
      minWidth: "8rem",
      maxWidth: "var(--kimak-available-width, none)",
      maxHeight: "var(--kimak-available-height, none)",
      overflow: "auto",
      padding: "1rem",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: t.border,
      borderRadius: t.radiusMd,
      backgroundColor: t.popover,
      color: t.popoverForeground,
      boxShadow: `0 4px 6px -1px ${mix("black", 10)}, 0 2px 4px -2px ${mix("black", 10)}`,
      outline: "none",
    },
    [title]: {
      margin: "0 0 0.25rem",
      fontSize: "0.875rem",
      fontWeight: "600",
      lineHeight: "1.25",
    },
    [description]: {
      margin: "0",
      fontSize: "0.875rem",
      color: t.mutedForeground,
    },
    "@media (prefers-reduced-motion: no-preference)": motion,
  };
}
