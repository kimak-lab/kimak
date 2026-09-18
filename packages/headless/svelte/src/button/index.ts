import Root from "./root.svelte";
import Indicator from "./indicator.svelte";
import type { ButtonProps as CoreButtonProps } from "@kimak/core";

export const Button = {
  Root,
  Indicator,
};

export type ButtonRootProps = CoreButtonProps;
export { buttonAnatomy } from "@kimak/spec";
