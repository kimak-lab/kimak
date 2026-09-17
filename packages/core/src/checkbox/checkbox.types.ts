import type {
  CheckboxDataState,
  CheckboxEvents,
  CheckboxProps as CheckboxSpecProps,
  CheckedState,
} from "@kimak/spec";

export type { CheckboxDataState, CheckedState } from "@kimak/spec";

export function getCheckedState(checked: boolean | "indeterminate"): CheckboxDataState {
  if (checked === "indeterminate") return "indeterminate";
  return checked ? "checked" : "unchecked";
}

export interface CheckboxProps extends CheckboxSpecProps, CheckboxEvents {}

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
