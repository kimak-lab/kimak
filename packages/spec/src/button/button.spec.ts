import type { ComponentSpec } from "../types";
import { buttonAria, buttonKeyboard } from "./button.a11y";
import type { ButtonPart } from "./button.anatomy";
import { buttonParts } from "./button.parts";
import type { ButtonEvents, ButtonProps } from "./button.types";

export const buttonSpec = {
  name: "button",
  description:
    "A press control for actions and form submit/reset. Headless: consumers style parts via data-slot. Activation is native Space/Enter, gated when disabled or loading. Loading stays focusable.",
  parts: buttonParts,
  props: {
    id: { type: "string", description: "Unique id used to generate part ids." },
    ids: {
      type: "Partial<Record<ButtonPart, string>>",
      description: "Overrides generated ids for individual parts.",
    },
    dir: { type: '"ltr" | "rtl"', description: "Text direction.", default: "ltr" },
    disabled: {
      type: "boolean",
      description: "Disables pointer and keyboard activation.",
      default: "false",
    },
    loading: {
      type: "boolean",
      description:
        "Blocks activation and marks the control as busy. Stays in the tab order (no native disabled).",
      default: "false",
    },
    focusableWhenDisabled: {
      type: "boolean",
      description:
        "Keep a disabled control in the tab order. Loading always keeps focus; this only changes disabled.",
      default: "false",
    },
    type: {
      type: '"button" | "submit" | "reset"',
      description: 'Native button type. Defaults to "button" so the control does not submit a form.',
      default: "button",
    },
    name: { type: "string", description: "Native form name." },
    value: { type: "string", description: "Native form value." },
    form: { type: "string", description: "Associates the button with a form id." },
  },
  events: {
    onPress: {
      payload: "{}",
      description: "Fired when the button is activated and not disabled or loading.",
    },
  },
  keyboard: buttonKeyboard,
  aria: buttonAria,
} as const satisfies ComponentSpec<ButtonPart, keyof ButtonProps, keyof ButtonEvents>;
