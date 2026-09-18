import Root from "./root.svelte";
import Label from "./label.svelte";
import Control from "./control.svelte";
import Indicator from "./indicator.svelte";
import HiddenInput from "./hidden-input.svelte";
import type { CheckboxProps as CoreCheckboxProps } from "@kimak/core";

export const Checkbox = {
  Root,
  Label,
  Control,
  Indicator,
  HiddenInput,
};

export type CheckboxRootProps = CoreCheckboxProps;
export { checkboxAnatomy } from "@kimak/spec";
