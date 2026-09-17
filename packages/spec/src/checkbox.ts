import { createAnatomy } from "./anatomy";
import type { ComponentSpec } from "./types";

export const checkboxAnatomy = createAnatomy("checkbox", [
  "root",
  "label",
  "control",
  "indicator",
  "hiddenInput",
] as const);

export const checkboxSpec = {
  name: "checkbox",
  description:
    "A dual-state (or mixed) control for boolean form values. Headless: consumers style parts via data-slot and data-state.",
  parts: {
    root: {
      slot: "root",
      tag: "label",
      dataAttrs: ["data-state", "data-disabled", "data-invalid", "data-readonly", "data-required"],
    },
    label: {
      slot: "label",
      tag: "span",
      dataAttrs: ["data-state", "data-disabled"],
    },
    control: {
      slot: "control",
      tag: "span",
      role: "checkbox",
      dataAttrs: ["data-state", "data-disabled", "data-invalid"],
    },
    indicator: {
      slot: "indicator",
      tag: "span",
      dataAttrs: ["data-state"],
    },
    hiddenInput: {
      slot: "hiddenInput",
      tag: "input",
      dataAttrs: [],
    },
  },
  props: {
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
    dir: { type: '"ltr" | "rtl"', description: "Text direction.", default: "ltr" },
  },
  events: {
    onCheckedChange: {
      payload: "{ checked: boolean | \"indeterminate\" }",
      description: "Fired when the checked state should change.",
    },
  },
  keyboard: [
    { key: "Space", when: "control focused and not disabled/readOnly", then: "toggle", preventDefault: true },
    { key: "Enter", when: "control focused and not disabled/readOnly", then: "toggle", preventDefault: true },
  ],
  aria: [
    "control has role=checkbox",
    "aria-checked is true, false, or mixed",
    "aria-disabled, aria-invalid, aria-required when set",
    "hidden input is aria-hidden and used for form association only",
  ],
} as const satisfies ComponentSpec<(typeof checkboxAnatomy.parts)[number]>;
