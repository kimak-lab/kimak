import { createAnatomy } from "./anatomy";
import type { CommonProps, ComponentSpec } from "./types";

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

export type DialogPart = (typeof dialogAnatomy.parts)[number];

export type DialogDataState = "open" | "closed";

export type DialogRole = "dialog" | "alertdialog";

export interface DialogProps extends CommonProps {
  /** Overrides generated ids for individual parts. */
  ids?: Partial<Record<DialogPart, string>>;
  /** Controlled open state. */
  open?: boolean;
  /**
   * Uncontrolled initial open state.
   * @default false
   */
  defaultOpen?: boolean;
  /**
   * When true, traps focus, locks scroll, and marks aria-modal.
   * @default true
   */
  modal?: boolean;
  /**
   * Dismiss on Escape when this layer is top-most.
   * @default true
   */
  closeOnEscape?: boolean;
  /**
   * Dismiss on pointer down outside content when this layer is top-most.
   * @default true
   */
  closeOnInteractOutside?: boolean;
  /**
   * Keep portal children mounted while closed (exit animation).
   * @default false
   */
  forceMount?: boolean;
  /**
   * Prevents opening from the trigger.
   * @default false
   */
  disabled?: boolean;
  /**
   * Accessible role for content. Use `alertdialog` for urgent confirmation.
   * @default "dialog"
   */
  role?: DialogRole;
}

export interface DialogEvents {
  /** Fired when the open state should change. */
  onOpenChange?: (details: { open: boolean }) => void;
}

const dialogDataStates = ["open", "closed"] as const satisfies readonly DialogDataState[];

export const dialogSpec = {
  name: "dialog",
  description:
    "A modal or non-modal overlay with a focus trap, dismiss layer, and optional portal. Headless: no chrome.",
  parts: {
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
  },
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
  keyboard: [
    {
      key: "Enter",
      code: "Enter",
      slot: "trigger",
      when: "trigger focused and not disabled",
      then: "open",
    },
    {
      key: "Space",
      code: "Space",
      slot: "trigger",
      when: "trigger focused and not disabled",
      then: "open",
    },
    {
      key: "Escape",
      code: "Escape",
      slot: "content",
      when: "open and top-most layer",
      then: "close",
      preventDefault: true,
    },
    {
      key: "Tab",
      code: "Tab",
      slot: "content",
      when: "open and modal",
      then: "cycle focus inside content",
      preventDefault: true,
    },
  ],
  aria: [
    "content has role=dialog or alertdialog",
    "aria-modal=true when modal",
    "aria-labelledby points at title",
    "aria-describedby points at description when present",
    "trigger has aria-haspopup=dialog, aria-expanded, aria-controls",
  ],
  presence: {
    parts: ["backdrop", "positioner", "content"],
    forceMount: true,
  },
} as const satisfies ComponentSpec<DialogPart, keyof DialogProps, keyof DialogEvents>;
