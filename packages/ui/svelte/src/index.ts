import {
  Button as ButtonParts,
  Checkbox as CheckboxParts,
  Dialog as DialogParts,
} from "@kimak/headless-svelte";
import ButtonField from "./button.svelte";
import CheckboxField from "./checkbox.svelte";
import DialogContent from "./dialog-content.svelte";

export const Button = Object.assign(ButtonField, {
  Root: ButtonParts.Root,
  Indicator: ButtonParts.Indicator,
});

export const Checkbox = Object.assign(CheckboxField, {
  Root: CheckboxParts.Root,
  Label: CheckboxParts.Label,
  Control: CheckboxParts.Control,
  Indicator: CheckboxParts.Indicator,
  HiddenInput: CheckboxParts.HiddenInput,
});

export const Dialog = {
  Root: DialogParts.Root,
  Trigger: DialogParts.Trigger,
  Portal: DialogParts.Portal,
  Backdrop: DialogParts.Backdrop,
  Positioner: DialogParts.Positioner,
  Content: DialogContent,
  Title: DialogParts.Title,
  Description: DialogParts.Description,
  Close: DialogParts.Close,
};

export type { ButtonRootProps as ButtonProps } from "@kimak/headless-svelte";
export type { CheckboxRootProps as CheckboxProps } from "@kimak/headless-svelte";
