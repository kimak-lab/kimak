import type { CommonProps } from "../types";
import type { CheckboxPart } from "./checkbox.anatomy";

export type CheckedState = boolean | "indeterminate";

export type CheckboxDataState = "checked" | "unchecked" | "indeterminate";

export const checkboxDataStates = [
  "checked",
  "unchecked",
  "indeterminate",
] as const satisfies readonly CheckboxDataState[];

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
