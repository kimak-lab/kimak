import type { PartContract } from "../types";
import type { PopoverPart } from "./popover.anatomy";

const openStates = ["open", "closed"] as const;

export const popoverParts = {
  trigger: {
    slot: "trigger",
    tag: "button",
    dataAttrs: ["data-state"],
    dataStates: openStates,
    ariaAttrs: ["aria-haspopup", "aria-expanded", "aria-controls"],
  },
  positioner: {
    slot: "positioner",
    tag: "div",
    dataAttrs: ["data-state", "data-side", "data-align"],
    dataStates: openStates,
  },
  content: {
    slot: "content",
    tag: "div",
    role: "dialog",
    dataAttrs: ["data-state", "data-side", "data-align"],
    dataStates: openStates,
    ariaAttrs: ["aria-labelledby", "aria-describedby"],
  },
  title: {
    slot: "title",
    tag: "h2",
    dataAttrs: [],
  },
  description: {
    slot: "description",
    tag: "p",
    dataAttrs: [],
  },
  close: {
    slot: "close",
    tag: "button",
    dataAttrs: [],
  },
} as const satisfies Record<PopoverPart, PartContract<PopoverPart>>;
