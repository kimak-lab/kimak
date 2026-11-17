import type { PopoverEvents, PopoverProps as PopoverSpecProps } from "@kimak/spec";
import type { Position } from "../platform/position";
import type { CommonProps } from "../types";

export type { PopoverAlign, PopoverSide } from "@kimak/spec";

export interface PopoverProps extends PopoverSpecProps, PopoverEvents, CommonProps {}

export interface PopoverRendered {
  title: boolean;
  description: boolean;
}

export interface PopoverContext {
  /** Uncontrolled open state. Ignored while `props.open` is defined. */
  open: boolean;
  /** Last measured placement. `null` until the positioner is measured. */
  position: Position | null;
  /** Which labelling parts are in the DOM, so aria ids never dangle. */
  rendered: PopoverRendered;
}

export type PopoverEvent =
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "TOGGLE" }
  | { type: "POSITION"; position: Position }
  | { type: "RENDERED"; rendered: PopoverRendered };

export const popoverDefaults = {
  side: "bottom",
  align: "center",
  sideOffset: 4,
  collisionPadding: 8,
  closeOnEscape: true,
  closeOnInteractOutside: true,
} as const;
