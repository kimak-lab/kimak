export const buttonGroupOrientations = ["horizontal", "vertical"] as const;

export type ButtonGroupOrientation = (typeof buttonGroupOrientations)[number];

/** Look-only root attrs. `ButtonGroup` adds `role="group"`; add it yourself when spreading these. */
export function buttonGroupAttrs(input: { orientation?: ButtonGroupOrientation } = {}) {
  return {
    "data-scope": "button-group",
    "data-slot": "root",
    "data-orientation": input.orientation ?? "horizontal",
  };
}

/** Separator orientation defaults to `vertical`, the divider for a horizontal group. */
export function buttonGroupSeparatorAttrs(input: { orientation?: ButtonGroupOrientation } = {}) {
  return {
    "data-scope": "button-group",
    "data-slot": "separator",
    "data-orientation": input.orientation ?? "vertical",
  };
}

export function buttonGroupTextAttrs() {
  return {
    "data-scope": "button-group",
    "data-slot": "text",
  };
}
