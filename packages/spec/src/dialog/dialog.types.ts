import type { CommonProps } from "../types";
import type { DialogPart } from "./dialog.anatomy";

export type DialogDataState = "open" | "closed";

export type DialogRole = "dialog" | "alertdialog";

export const dialogDataStates = ["open", "closed"] as const satisfies readonly DialogDataState[];

export interface DialogProps extends CommonProps {
  /** Overrides generated ids for individual parts. */
  ids?: Partial<Record<DialogPart, string>>;
  /** Controlled open state. */
  open?: boolean;
  /**
   * Uncontrolled initial open state.
   * @default false
   */
  defaultOpen?: boolean;
  /**
   * When true, traps focus, locks scroll, and marks aria-modal.
   * @default true
   */
  modal?: boolean;
  /**
   * Dismiss on Escape when this layer is top-most.
   * @default true
   */
  closeOnEscape?: boolean;
  /**
   * Dismiss on pointer down outside content when this layer is top-most.
   * @default true
   */
  closeOnInteractOutside?: boolean;
  /**
   * Keep portal children mounted while closed (exit animation).
   * @default false
   */
  forceMount?: boolean;
  /**
   * Prevents opening from the trigger.
   * @default false
   */
  disabled?: boolean;
  /**
   * Accessible role for content. Use `alertdialog` for urgent confirmation.
   * @default "dialog"
   */
  role?: DialogRole;
}

export interface DialogEvents {
  /** Fired when the open state should change. */
  onOpenChange?: (details: { open: boolean }) => void;
}
