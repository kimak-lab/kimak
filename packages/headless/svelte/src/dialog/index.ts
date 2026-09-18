import Root from "./root.svelte";
import Trigger from "./trigger.svelte";
import Portal from "./portal.svelte";
import Backdrop from "./backdrop.svelte";
import Positioner from "./positioner.svelte";
import Content from "./content.svelte";
import Title from "./title.svelte";
import Description from "./description.svelte";
import Close from "./close.svelte";
import type { DialogProps as CoreDialogProps } from "@kimak/core";

export const Dialog = {
  Root,
  Trigger,
  Portal,
  Backdrop,
  Positioner,
  Content,
  Title,
  Description,
  Close,
};

export type DialogRootProps = CoreDialogProps;
export { dialogAnatomy } from "@kimak/spec";
