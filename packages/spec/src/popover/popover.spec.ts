import type { ComponentSpec } from "../types";
import { popoverAria, popoverKeyboard } from "./popover.a11y";
import type { PopoverPart } from "./popover.anatomy";
import { popoverParts } from "./popover.parts";
import type { PopoverEvents, PopoverProps } from "./popover.types";

export const popoverSpec = {
  name: "popover",
  description:
    "A non-modal dialog anchored to a trigger. Headless: consumers style parts via data-slot. Positions itself next to the trigger, flips and shifts to stay in the viewport, and dismisses on Escape or interaction outside.",
  parts: popoverParts,
  props: {
    id: { type: "string", description: "Unique id used to generate part ids." },
    ids: {
      type: "Partial<Record<PopoverPart, string>>",
      description: "Overrides generated ids for individual parts.",
    },
    dir: { type: '"ltr" | "rtl"', description: "Text direction.", default: "ltr" },
    open: {
      type: "boolean",
      description: "Controlled open state. Pair with onOpenChange.",
      controlled: true,
    },
    defaultOpen: {
      type: "boolean",
      description: "Initial open state when uncontrolled.",
      default: "false",
    },
    side: {
      type: '"top" | "right" | "bottom" | "left"',
      description: "Preferred side of the trigger. Flips to the opposite side when it does not fit.",
      default: "bottom",
    },
    align: {
      type: '"start" | "center" | "end"',
      description: "Alignment against the trigger on the cross axis. start / end follow dir.",
      default: "center",
    },
    sideOffset: {
      type: "number",
      description: "Gap between the trigger and the positioner, in px.",
      default: "4",
    },
    collisionPadding: {
      type: "number",
      description: "Minimum distance from the viewport edge, in px.",
      default: "8",
    },
    closeOnEscape: {
      type: "boolean",
      description: "Close when Escape is pressed.",
      default: "true",
    },
    closeOnInteractOutside: {
      type: "boolean",
      description: "Close on pointer down or focus outside the trigger and content.",
      default: "true",
    },
  },
  events: {
    onOpenChange: {
      payload: "boolean",
      description: "Fired when the popover requests an open state change.",
    },
  },
  keyboard: popoverKeyboard,
  aria: popoverAria,
  presence: {
    parts: ["positioner", "content"],
    forceMount: false,
  },
} as const satisfies ComponentSpec<PopoverPart, keyof PopoverProps, keyof PopoverEvents>;
