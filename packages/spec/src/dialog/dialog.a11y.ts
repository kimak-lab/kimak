import type { KeyBinding } from "../types";
import type { DialogPart } from "./dialog.anatomy";

export const dialogKeyboard = [
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
] as const satisfies readonly KeyBinding<DialogPart>[];

export const dialogAria = [
  "content has role=dialog or alertdialog",
  "aria-modal=true when modal",
  "aria-labelledby points at title",
  "aria-describedby points at description when present",
  "trigger has aria-haspopup=dialog, aria-expanded, aria-controls",
] as const;

export const dialogPresence = {
  parts: ["backdrop", "positioner", "content"],
  forceMount: true,
} as const satisfies {
  parts: readonly DialogPart[];
  forceMount: boolean;
};
