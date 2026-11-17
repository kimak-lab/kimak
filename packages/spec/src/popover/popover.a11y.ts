import type { KeyBinding } from "../types";
import type { PopoverPart } from "./popover.anatomy";

export const popoverKeyboard = [
  {
    key: "Enter",
    code: "Enter",
    slot: "trigger",
    when: "trigger focused",
    then: "toggle",
  },
  {
    key: "Space",
    code: "Space",
    slot: "trigger",
    when: "trigger focused",
    then: "toggle",
  },
  {
    key: "Escape",
    code: "Escape",
    slot: "content",
    when: "open and closeOnEscape",
    then: "close and focus trigger",
    preventDefault: true,
  },
  {
    key: "Tab",
    code: "Tab",
    slot: "content",
    when: "focus leaves trigger and content",
    then: "close",
  },
] as const satisfies readonly KeyBinding<PopoverPart>[];

export const popoverAria = [
  "trigger is a native button with aria-haspopup=dialog",
  "trigger aria-expanded mirrors the open state",
  "trigger aria-controls points at content while open",
  "content has role=dialog, labelled by title and described by description when rendered",
  "non-modal: focus is not trapped; focus moves into content on open",
  "Escape or close returns focus to the trigger",
] as const;
