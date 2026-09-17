import { createAnatomy } from "./anatomy";
import type { CommonProps, ComponentSpec } from "./types";

export const checkboxAnatomy = createAnatomy("checkbox", [
  "root",
  "label",
  "control",
  "indicator",
  "hiddenInput",
] as const);

export type CheckboxPart = (typeof checkboxAnatomy.parts)[number];

export type CheckedState = boolean | "indeterminate";

export type CheckboxDataState = "checked" | "unchecked" | "indeterminate";

export interface CheckboxProps extends CommonProps {
  /** Overrides generated ids for individual parts. */
  ids?: Partial<Record<CheckboxPart, string>>;
  /** Controlled checked state. */
  checked?: CheckedState;
  /**
   * Uncontrolled initial checked state.
   * @default false
   */
  defaultChecked?: CheckedState;
  /**
   * Disables pointer and keyboard input.
   * @default false
   */
  disabled?: boolean;
  /**
   * Marks the control as invalid.
   * @default false
   */
  invalid?: boolean;
  /**
   * Marks the control as required.
   * @default false
   */
  required?: boolean;
  /**
   * Prevents changes while remaining focusable.
   * @default false
   */
  readOnly?: boolean;
  /** Native form name on the hidden input. */
  name?: string;
  /**
   * Native form value when checked.
   * @default "on"
   */
  value?: string;
  /** Associates the hidden input with a form id. */
  form?: string;
}

export interface CheckboxEvents {
  /** Fired when the checked state should change. */
  onCheckedChange?: (details: { checked: CheckedState }) => void;
}

const checkboxDataStates = [
  "checked",
  "unchecked",
  "indeterminate",
] as const satisfies readonly CheckboxDataState[];

export const checkboxSpec = {
  name: "checkbox",
  description:
    "A dual-state (or mixed) control for boolean form values. Headless: consumers style parts via data-slot and data-state.",
  parts: {
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
  },
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
  keyboard: [
    {
      key: "Space",
      code: "Space",
      slot: "control",
      when: "control focused and not disabled/readOnly",
      then: "toggle",
      preventDefault: true,
    },
  ],
  aria: [
    "control has role=checkbox",
    "aria-checked is true, false, or mixed",
    "aria-disabled, aria-invalid, aria-required, aria-readonly when set",
    "hidden input is aria-hidden and used for form association only",
  ],
} as const satisfies ComponentSpec<CheckboxPart, keyof CheckboxProps, keyof CheckboxEvents>;
