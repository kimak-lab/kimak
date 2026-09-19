import type { CommonProps } from "../types";
import type { ButtonPart } from "./button.anatomy";

export type ButtonType = "button" | "submit" | "reset";

export interface ButtonProps extends CommonProps {
  /** Overrides generated ids for individual parts. */
  ids?: Partial<Record<ButtonPart, string>>;
  /**
   * Disables pointer and keyboard activation.
   * @default false
   */
  disabled?: boolean;
  /**
   * Blocks activation and marks the control as busy. Loading stays in the tab
   * order: native `disabled` is omitted; `aria-disabled` and `aria-busy` stay on.
   * @default false
   */
  loading?: boolean;
  /**
   * Keep a disabled control in the tab order (`aria-disabled` instead of native
   * `disabled`). Loading always keeps focus; this flag only changes `disabled`.
   * @default false
   */
  focusableWhenDisabled?: boolean;
  /**
   * Native button type. Defaults to `"button"` so the control does not submit a form.
   * @default "button"
   */
  type?: ButtonType;
  /** Native form name. */
  name?: string;
  /** Native form value. */
  value?: string;
  /** Associates the button with a form id. */
  form?: string;
}

export interface ButtonEvents {
  /** Fired when the button is activated and not disabled or loading. */
  onPress?: () => void;
}
