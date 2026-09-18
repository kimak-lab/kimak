import type { ComponentSpec } from "../types";
import type { DialogPart } from "./dialog.anatomy";
import { dialogAria, dialogKeyboard, dialogPresence } from "./dialog.a11y";
import { dialogParts } from "./dialog.parts";
import type { DialogEvents, DialogProps } from "./dialog.types";

export const dialogSpec = {
  name: "dialog",
  description:
    "A modal or non-modal overlay with a focus trap, dismiss layer, and optional portal. Headless: no chrome.",
  parts: dialogParts,
  props: {
    id: { type: "string", description: "Unique id used to generate part ids." },
    ids: {
      type: "Partial<Record<DialogPart, string>>",
      description: "Overrides generated ids for individual parts.",
    },
    dir: { type: '"ltr" | "rtl"', description: "Text direction.", default: "ltr" },
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
    disabled: {
      type: "boolean",
      description: "Prevents opening from the trigger.",
      default: "false",
    },
    role: {
      type: '"dialog" | "alertdialog"',
      description: "Accessible role for content. Use alertdialog for urgent confirmation.",
      default: "dialog",
    },
  },
  events: {
    onOpenChange: {
      payload: "{ open: boolean }",
      description: "Fired when the open state should change.",
    },
  },
  keyboard: dialogKeyboard,
  aria: dialogAria,
  presence: dialogPresence,
} as const satisfies ComponentSpec<DialogPart, keyof DialogProps, keyof DialogEvents>;
