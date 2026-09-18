import type { ComponentSpec } from "../types";
import { checkboxAria, checkboxKeyboard } from "./checkbox.a11y";
import type { CheckboxPart } from "./checkbox.anatomy";
import { checkboxParts } from "./checkbox.parts";
import type { CheckboxEvents, CheckboxProps } from "./checkbox.types";

export const checkboxSpec = {
  name: "checkbox",
  description:
    "A dual-state (or mixed) control for boolean form values. Headless: consumers style parts via data-slot and data-state.",
  parts: checkboxParts,
  props: {
    id: { type: "string", description: "Unique id used to generate part ids." },
    ids: {
      type: "Partial<Record<CheckboxPart, string>>",
      description: "Overrides generated ids for individual parts.",
    },
    dir: { type: '"ltr" | "rtl"', description: "Text direction.", default: "ltr" },
    checked: {
      type: 'boolean | "indeterminate"',
      description: "Controlled checked state.",
      controlled: true,
    },
    defaultChecked: {
      type: 'boolean | "indeterminate"',
      description: "Uncontrolled initial checked state.",
      default: "false",
    },
    disabled: { type: "boolean", description: "Disables pointer and keyboard input.", default: "false" },
    invalid: { type: "boolean", description: "Marks the control as invalid.", default: "false" },
    required: { type: "boolean", description: "Marks the control as required.", default: "false" },
    readOnly: { type: "boolean", description: "Prevents changes while remaining focusable.", default: "false" },
    name: { type: "string", description: "Native form name on the hidden input." },
    value: { type: "string", description: "Native form value when checked.", default: "on" },
    form: { type: "string", description: "Associates the hidden input with a form id." },
  },
  events: {
    onCheckedChange: {
      payload: '{ checked: boolean | "indeterminate" }',
      description: "Fired when the checked state should change.",
    },
  },
  keyboard: checkboxKeyboard,
  aria: checkboxAria,
} as const satisfies ComponentSpec<CheckboxPart, keyof CheckboxProps, keyof CheckboxEvents>;
