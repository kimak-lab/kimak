export const buttonGroupOrientations = ["horizontal", "vertical"] as const;

export type ButtonGroupOrientation = (typeof buttonGroupOrientations)[number];

export function buttonGroupAttrs(input: { orientation?: ButtonGroupOrientation } = {}) {
  return {
    "data-scope": "button-group",
    "data-slot": "root",
    "data-orientation": input.orientation ?? "horizontal",
  };
}
