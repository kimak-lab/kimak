import type { KeyBinding } from "../types";
import type { ButtonPart } from "./button.anatomy";

export const buttonKeyboard = [
  {
    key: "Enter",
    code: "Enter",
    slot: "root",
    when: "root focused and not disabled/loading",
    then: "press",
  },
  {
    key: "Space",
    code: "Space",
    slot: "root",
    when: "root focused and not disabled/loading",
    then: "press",
  },
] as const satisfies readonly KeyBinding<ButtonPart>[];

export const buttonAria = [
  "root is a native button (implicit role=button)",
  "aria-disabled when disabled or loading",
  "aria-busy when loading",
] as const;
