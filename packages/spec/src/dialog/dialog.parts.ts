import type { PartContract } from "../types";
import type { DialogPart } from "./dialog.anatomy";
import { dialogDataStates } from "./dialog.types";

export const dialogParts = {
  root: {
    slot: "root",
    tag: "div",
    dataAttrs: ["data-state"],
    dataStates: dialogDataStates,
  },
  trigger: {
    slot: "trigger",
    tag: "button",
    dataAttrs: ["data-state", "data-disabled"],
    dataStates: dialogDataStates,
    ariaAttrs: ["aria-haspopup", "aria-expanded", "aria-controls"],
  },
  portal: {
    slot: "portal",
    tag: "div",
    owner: "adapter",
    dataAttrs: [],
  },
  backdrop: {
    slot: "backdrop",
    tag: "div",
    dataAttrs: ["data-state"],
    dataStates: dialogDataStates,
  },
  positioner: {
    slot: "positioner",
    tag: "div",
    dataAttrs: ["data-state"],
    dataStates: dialogDataStates,
  },
  content: {
    slot: "content",
    tag: "div",
    role: "dialog",
    dataAttrs: ["data-state"],
    dataStates: dialogDataStates,
    ariaAttrs: ["aria-modal", "aria-labelledby", "aria-describedby"],
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
} as const satisfies Record<DialogPart, PartContract<DialogPart>>;
