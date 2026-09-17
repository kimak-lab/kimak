import { createAnatomy } from "./anatomy";
import type { ComponentSpec } from "./types";

export const dialogAnatomy = createAnatomy("dialog", [
  "root",
  "trigger",
  "portal",
  "backdrop",
  "positioner",
  "content",
  "title",
  "description",
  "close",
] as const);

export const dialogSpec = {
  name: "dialog",
  description:
    "A modal or non-modal overlay with a focus trap, dismiss layer, and optional portal. Headless: no chrome.",
  parts: {
    root: {
      slot: "root",
      tag: "div",
      dataAttrs: ["data-state"],
    },
    trigger: {
      slot: "trigger",
      tag: "button",
      dataAttrs: ["data-state", "data-disabled"],
    },
    portal: {
      slot: "portal",
      tag: "div",
      dataAttrs: [],
    },
    backdrop: {
      slot: "backdrop",
      tag: "div",
      dataAttrs: ["data-state"],
    },
    positioner: {
      slot: "positioner",
      tag: "div",
      dataAttrs: ["data-state"],
    },
    content: {
      slot: "content",
      tag: "div",
      role: "dialog",
      dataAttrs: ["data-state"],
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
  },
  props: {
    open: {
      type: "boolean",
      description: "Controlled open state.",
      controlled: true,
    },
    defaultOpen: {
      type: "boolean",
      description: "Uncontrolled initial open state.",
      default: "false",
    },
    modal: {
      type: "boolean",
      description: "When true, traps focus, locks scroll, and marks aria-modal.",
      default: "true",
    },
    closeOnEscape: {
      type: "boolean",
      description: "Dismiss on Escape when this layer is top-most.",
      default: "true",
    },
    closeOnInteractOutside: {
      type: "boolean",
      description: "Dismiss on pointer down outside content when this layer is top-most.",
      default: "true",
    },
    forceMount: {
      type: "boolean",
      description: "Keep portal children mounted while closed (exit animation).",
      default: "false",
    },
    dir: { type: '"ltr" | "rtl"', description: "Text direction.", default: "ltr" },
  },
  events: {
    onOpenChange: {
      payload: "{ open: boolean }",
      description: "Fired when the open state should change.",
    },
  },
  keyboard: [
    { key: "Enter / Space", when: "trigger focused", then: "open", preventDefault: true },
    { key: "Escape", when: "open and top-most layer", then: "close", preventDefault: true },
    { key: "Tab", when: "open and modal", then: "cycle focus inside content", preventDefault: true },
  ],
  aria: [
    "content has role=dialog",
    "aria-modal=true when modal",
    "aria-labelledby points at title",
    "aria-describedby points at description when present",
    "trigger has aria-haspopup=dialog, aria-expanded, aria-controls",
  ],
  presence: {
    parts: ["backdrop", "positioner", "content"],
    forceMount: true,
  },
} as const satisfies ComponentSpec<(typeof dialogAnatomy.parts)[number]>;
