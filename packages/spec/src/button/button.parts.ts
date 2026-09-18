import type { PartContract } from "../types";
import type { ButtonPart } from "./button.anatomy";

export const buttonParts = {
  root: {
    slot: "root",
    tag: "button",
    dataAttrs: ["data-disabled", "data-loading"],
    ariaAttrs: ["aria-disabled", "aria-busy"],
  },
  indicator: {
    slot: "indicator",
    tag: "span",
    dataAttrs: ["data-loading"],
  },
} as const satisfies Record<ButtonPart, PartContract<ButtonPart>>;
