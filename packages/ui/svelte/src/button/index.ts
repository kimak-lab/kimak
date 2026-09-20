import { Button as ButtonParts } from "@kimak/headless-svelte";
import ButtonField from "./button.svelte";

export const Button = Object.assign(ButtonField, {
  Root: ButtonParts.Root,
  Indicator: ButtonParts.Indicator,
});

export type { ButtonProps, ButtonMotionVariant } from "./button.svelte";

export {
  buttonAttrs,
  buttonSizes,
  buttonVariants,
  type ButtonSize,
  type ButtonVariant,
} from "./button-attrs";
