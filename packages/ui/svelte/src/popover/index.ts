import { Popover as Parts } from "@kimak/headless-svelte";
import Content from "./content.svelte";

/** Portal + Positioner + Content in one part. */
export const Popover = Object.assign(Parts.Root, {
  Root: Parts.Root,
  Trigger: Parts.Trigger,
  Content,
  Title: Parts.Title,
  Description: Parts.Description,
  Close: Parts.Close,
});

export type {
  PopoverCloseProps,
  PopoverDescriptionProps,
  PopoverRootProps as PopoverProps,
  PopoverTitleProps,
  PopoverTriggerProps,
} from "@kimak/headless-svelte";
export type { PopoverContentProps } from "./content.svelte";
export { popoverContentAttrs } from "./popover-attrs";
export { usePopover } from "@kimak/headless-svelte";
