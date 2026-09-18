import type { PartContract } from "../types";
import type { CheckboxPart } from "./checkbox.anatomy";
import { checkboxDataStates } from "./checkbox.types";

export const checkboxParts = {
  root: {
    slot: "root",
    tag: "label",
    dataAttrs: ["data-state", "data-disabled", "data-invalid", "data-readonly", "data-required"],
    dataStates: checkboxDataStates,
  },
  label: {
    slot: "label",
    tag: "span",
    dataAttrs: ["data-state", "data-disabled"],
    dataStates: checkboxDataStates,
  },
  control: {
    slot: "control",
    tag: "span",
    role: "checkbox",
    dataAttrs: ["data-state", "data-disabled", "data-invalid", "data-readonly", "data-required"],
    dataStates: checkboxDataStates,
    ariaAttrs: ["aria-checked", "aria-disabled", "aria-invalid", "aria-required", "aria-readonly"],
  },
  indicator: {
    slot: "indicator",
    tag: "span",
    dataAttrs: ["data-state"],
    dataStates: checkboxDataStates,
  },
  hiddenInput: {
    slot: "hiddenInput",
    tag: "input",
    dataAttrs: [],
    ariaAttrs: ["aria-hidden"],
  },
} as const satisfies Record<CheckboxPart, PartContract<CheckboxPart>>;
