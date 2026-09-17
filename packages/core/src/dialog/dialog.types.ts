import type { DialogEvents, DialogProps as DialogSpecProps } from "@kimak/spec";

export type { DialogDataState, DialogRole } from "@kimak/spec";

export interface DialogProps extends DialogSpecProps, DialogEvents {}

export interface DialogContext {
  open: boolean;
}

export type DialogEvent =
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "TOGGLE" }
  | { type: "SET_OPEN"; open: boolean };
