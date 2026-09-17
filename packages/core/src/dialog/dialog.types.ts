import type { Direction } from "../types";

export interface DialogProps {
  id?: string;
  ids?: Partial<Record<"trigger" | "content" | "title" | "description" | "backdrop", string>>;
  dir?: Direction;
  open?: boolean;
  defaultOpen?: boolean;
  modal?: boolean;
  closeOnEscape?: boolean;
  closeOnInteractOutside?: boolean;
  forceMount?: boolean;
  disabled?: boolean;
  role?: "dialog" | "alertdialog";
  onOpenChange?: (details: { open: boolean }) => void;
}

export interface DialogContext {
  open: boolean;
}

export type DialogEvent =
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "TOGGLE" }
  | { type: "SET_OPEN"; open: boolean };
