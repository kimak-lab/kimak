import Root from "./root.svelte";
import Indicator from "./indicator.svelte";
import type { ButtonProps as CoreButtonProps } from "@kimak/core";

export type ButtonAs = "button" | "a";

export const Button = {
  Root,
  Indicator,
};

export interface ButtonRootProps extends CoreButtonProps {
  as?: ButtonAs;
}
export { buttonAnatomy } from "@kimak/spec";
