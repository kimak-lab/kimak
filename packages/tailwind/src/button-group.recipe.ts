// Deep import: jiti's plugin loader drops named re-exports from the @kimak/spec barrel.
import { buttonAnatomy } from "../../spec/src/button/button.anatomy";
import { buttonGroupAnatomy } from "../../spec/src/button-group/button-group.anatomy";
import { t } from "./theme";
import type { CssInJs } from "./types";

export function buttonGroupRecipe(): CssInJs {
  const group = buttonGroupAnatomy.root.selector;
  const button = buttonAnatomy.root.selector;

  return {
    [group]: {
      display: "inline-flex",
      alignItems: "center",
      borderRadius: t.radiusMd,
    },
    [`${group}[data-orientation="horizontal"]`]: {
      flexDirection: "row",
    },
    [`${group}[data-orientation="vertical"]`]: {
      flexDirection: "column",
      alignItems: "stretch",
    },
    [`${group} ${button}`]: {
      borderRadius: "0",
    },
    [`${group}[data-orientation="horizontal"] ${button}:not(:first-child)`]: {
      marginInlineStart: "-1px",
    },
    [`${group}[data-orientation="vertical"] ${button}:not(:first-child)`]: {
      marginBlockStart: "-1px",
    },
    [`${group}[data-orientation="horizontal"] ${button}:first-child`]: {
      borderStartStartRadius: t.radiusMd,
      borderEndStartRadius: t.radiusMd,
    },
    [`${group}[data-orientation="horizontal"] ${button}:last-child`]: {
      borderStartEndRadius: t.radiusMd,
      borderEndEndRadius: t.radiusMd,
    },
    [`${group}[data-orientation="vertical"] ${button}:first-child`]: {
      borderStartStartRadius: t.radiusMd,
      borderStartEndRadius: t.radiusMd,
    },
    [`${group}[data-orientation="vertical"] ${button}:last-child`]: {
      borderEndStartRadius: t.radiusMd,
      borderEndEndRadius: t.radiusMd,
    },
    [`${group} ${button}:focus-visible`]: {
      zIndex: "1",
    },
  };
}
