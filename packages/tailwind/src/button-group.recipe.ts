// Deep import: jiti's plugin loader drops named re-exports from the @kimak/spec barrel.
import { buttonGroupAnatomy } from "../../spec/src/button-group/button-group.anatomy";
import { t } from "./theme";
import type { CssInJs } from "./types";

/**
 * Joins every direct child (Button, input, trigger, text, nested group) into one
 * control. Child combinators keep a wrapped button or a nested group from
 * inheriting the outer group's corners.
 */
export function buttonGroupRecipe(): CssInJs {
  const group = buttonGroupAnatomy.root.selector;
  const separator = buttonGroupAnatomy.separator.selector;
  const text = buttonGroupAnatomy.text.selector;
  const horizontal = `${group}[data-orientation="horizontal"]`;
  const vertical = `${group}[data-orientation="vertical"]`;

  return {
    [group]: {
      display: "flex",
      width: "fit-content",
      alignItems: "stretch",
    },
    [`${group} > *:focus-visible`]: {
      position: "relative",
      zIndex: "1",
    },
    [`${group} > input`]: {
      flex: "1 1 0%",
      minWidth: "0",
    },
    // Nested groups keep their own joins and sit apart from each other.
    [`${group}:has(> ${group})`]: {
      gap: "0.5rem",
    },

    [horizontal]: {
      flexDirection: "row",
    },
    [`${horizontal} > *:not(:first-child)`]: {
      borderStartStartRadius: "0",
      borderEndStartRadius: "0",
      borderInlineStartWidth: "0",
    },
    [`${horizontal} > *:not(:last-child)`]: {
      borderStartEndRadius: "0",
      borderEndEndRadius: "0",
    },

    [vertical]: {
      flexDirection: "column",
    },
    [`${vertical} > *:not(:first-child)`]: {
      borderStartStartRadius: "0",
      borderStartEndRadius: "0",
      borderBlockStartWidth: "0",
    },
    [`${vertical} > *:not(:last-child)`]: {
      borderEndStartRadius: "0",
      borderEndEndRadius: "0",
    },

    [separator]: {
      position: "relative",
      flexShrink: "0",
      alignSelf: "stretch",
      margin: "0",
      border: "0",
      backgroundColor: t.input,
    },
    [`${separator}[data-orientation="vertical"]`]: {
      width: "1px",
    },
    [`${separator}[data-orientation="horizontal"]`]: {
      height: "1px",
    },

    [text]: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      padding: "0 1rem",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: t.border,
      borderRadius: t.radiusMd,
      backgroundColor: t.muted,
      color: t.foreground,
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
      fontWeight: "500",
      boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    },
    [`${text} svg`]: {
      pointerEvents: "none",
      flexShrink: "0",
      width: "1rem",
      height: "1rem",
    },
  };
}
