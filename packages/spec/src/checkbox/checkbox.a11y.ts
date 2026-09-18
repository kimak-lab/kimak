import type { KeyBinding } from "../types";
import type { CheckboxPart } from "./checkbox.anatomy";

export const checkboxKeyboard = [
  {
    key: "Space",
    code: "Space",
    slot: "control",
    when: "control focused and not disabled/readOnly",
    then: "toggle",
    preventDefault: true,
  },
] as const satisfies readonly KeyBinding<CheckboxPart>[];

export const checkboxAria = [
  "control has role=checkbox",
  "aria-checked is true, false, or mixed",
  "aria-disabled, aria-invalid, aria-required, aria-readonly when set",
  "hidden input is aria-hidden and used for form association only",
] as const;
