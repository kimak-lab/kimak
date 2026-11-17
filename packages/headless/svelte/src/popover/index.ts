import Root from "./root.svelte";
import Trigger from "./trigger.svelte";
import Positioner from "./positioner.svelte";
import Content from "./content.svelte";
import Title from "./title.svelte";
import Description from "./description.svelte";
import Close from "./close.svelte";
import type { PopoverProps as CorePopoverProps } from "@kimak/core";
import type { Snippet } from "svelte";

export const Popover = {
  Root,
  Trigger,
  Positioner,
  Content,
  Title,
  Description,
  Close,
};

export { usePopover } from "./context";

export interface PopoverRootProps extends CorePopoverProps {
  children?: Snippet;
}

export interface PopoverPartProps {
  children?: Snippet;
  /** Host tag. Adapter-local composition, not a portable contract. */
  as?: string;
}

export interface PopoverPresenceProps extends PopoverPartProps {
  forceMount?: boolean;
}

export type PopoverTriggerProps = PopoverPartProps;
export type PopoverPositionerProps = PopoverPresenceProps;
export type PopoverContentProps = PopoverPresenceProps;
export type PopoverTitleProps = PopoverPartProps;
export type PopoverDescriptionProps = PopoverPartProps;
export type PopoverCloseProps = PopoverPartProps;

export { popoverAnatomy } from "@kimak/spec";
