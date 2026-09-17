import type { Direction } from "../types";

export type CheckedState = boolean | "indeterminate";

export interface CheckboxProps {
  id?: string;
  ids?: Partial<Record<"root" | "control" | "hiddenInput" | "label", string>>;
  dir?: Direction;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  readOnly?: boolean;
  name?: string;
  form?: string;
  value?: string;
  checked?: CheckedState;
  defaultChecked?: CheckedState;
  onCheckedChange?: (details: { checked: CheckedState }) => void;
}

export interface CheckboxContext {
  checked: CheckedState;
}

export type CheckboxEvent =
  | { type: "TOGGLE" }
  | { type: "SET_CHECKED"; checked: CheckedState };

export function isChecked(value: CheckedState): boolean {
  return value === true;
}

export function toggleChecked(value: CheckedState): boolean {
  return value !== true;
}

export function getAriaChecked(value: CheckedState): "true" | "false" | "mixed" {
  if (value === "indeterminate") return "mixed";
  return value ? "true" : "false";
}
