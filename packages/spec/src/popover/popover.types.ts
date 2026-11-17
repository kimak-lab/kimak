import type { CommonProps } from "../types";
import type { PopoverPart } from "./popover.anatomy";

export type PopoverSide = "top" | "right" | "bottom" | "left";

export type PopoverAlign = "start" | "center" | "end";

export interface PopoverProps extends CommonProps {
  /** Overrides generated ids for individual parts. */
  ids?: Partial<Record<PopoverPart, string>>;
  /** Controlled open state. Pair with `onOpenChange`. */
  open?: boolean;
  /**
   * Initial open state when uncontrolled.
   * @default false
   */
  defaultOpen?: boolean;
  /**
   * Preferred side of the trigger. Flips to the opposite side when it does not fit.
   * @default "bottom"
   */
  side?: PopoverSide;
  /**
   * Alignment against the trigger on the cross axis. `start` / `end` follow `dir`.
   * @default "center"
   */
  align?: PopoverAlign;
  /**
   * Gap between the trigger and the positioner, in px.
   * @default 4
   */
  sideOffset?: number;
  /**
   * Minimum distance from the viewport edge, in px.
   * @default 8
   */
  collisionPadding?: number;
  /**
   * Close when Escape is pressed.
   * @default true
   */
  closeOnEscape?: boolean;
  /**
   * Close on pointer down or focus outside the trigger and content.
   * @default true
   */
  closeOnInteractOutside?: boolean;
}

export interface PopoverEvents {
  /** Fired when the popover requests an open state change. */
  onOpenChange?: (open: boolean) => void;
}
