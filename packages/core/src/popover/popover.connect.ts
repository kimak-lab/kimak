import { popoverAnatomy } from "@kimak/spec";
import { createIds } from "../platform/ids";
import { getPresenceState } from "../platform/presence";
import type { DictPropTypes, NormalizeProps, PropTypes } from "../normalize";
import { isPopoverOpen, type PopoverService } from "./popover.machine";
import { popoverDefaults, type PopoverAlign, type PopoverSide } from "./popover.types";

export interface PopoverApi<T extends PropTypes = DictPropTypes> {
  open: boolean;
  /** Side after collision handling. Equals the `side` prop until measured. */
  side: PopoverSide;
  align: PopoverAlign;
  setOpen: (open: boolean) => void;
  getTriggerProps: () => T["button"];
  getPositionerProps: () => T["element"];
  getContentProps: () => T["element"];
  getTitleProps: () => T["element"];
  getDescriptionProps: () => T["element"];
  getCloseProps: () => T["button"];
}

export function getPopoverIds(props: { id?: string; ids?: Partial<Record<string, string>> }) {
  return {
    ...createIds(props.id ?? "popover", popoverAnatomy.parts),
    ...props.ids,
  } as Record<(typeof popoverAnatomy.parts)[number], string>;
}

export function connectPopover<T extends PropTypes>(
  service: PopoverService,
  normalize: NormalizeProps<T>,
): PopoverApi<T> {
  const { context, props } = service.getSnapshot();
  const open = isPopoverOpen(context, props);
  const state = getPresenceState(open);
  const ids = getPopoverIds(props);
  const position = context.position;
  const side = position?.side ?? props.side ?? popoverDefaults.side;
  const align = position?.align ?? props.align ?? popoverDefaults.align;
  const dir = props.dir ?? "ltr";

  return {
    open,
    side,
    align,
    setOpen: (next) => {
      service.send({ type: next ? "OPEN" : "CLOSE" });
    },
    getTriggerProps: () =>
      normalize.button({
        ...popoverAnatomy.trigger.attrs(),
        id: ids.trigger,
        dir,
        type: "button",
        "data-state": state,
        "aria-haspopup": "dialog",
        "aria-expanded": open,
        "aria-controls": open ? ids.content : undefined,
        ref: (node: HTMLElement | null) => {
          service.refs.trigger = node;
        },
        onClick: () => {
          service.send({ type: "TOGGLE" });
        },
      }),
    getPositionerProps: () =>
      normalize.element({
        ...popoverAnatomy.positioner.attrs(),
        id: ids.positioner,
        dir,
        "data-state": state,
        "data-side": side,
        "data-align": align,
        style: {
          position: "fixed",
          top: 0,
          left: 0,
          minWidth: "max-content",
          transform: position ? `translate3d(${position.x}px, ${position.y}px, 0)` : undefined,
          "--kimak-available-width": position ? `${position.availableWidth}px` : undefined,
          "--kimak-available-height": position ? `${position.availableHeight}px` : undefined,
          "--kimak-anchor-width": position ? `${position.anchorWidth}px` : undefined,
          "--kimak-anchor-height": position ? `${position.anchorHeight}px` : undefined,
        },
        ref: (node: HTMLElement | null) => {
          service.refs.positioner = node;
        },
      }),
    getContentProps: () =>
      normalize.element({
        ...popoverAnatomy.content.attrs(),
        id: ids.content,
        dir,
        role: "dialog",
        tabIndex: -1,
        "data-state": state,
        "data-side": side,
        "data-align": align,
        "aria-labelledby": context.rendered.title ? ids.title : undefined,
        "aria-describedby": context.rendered.description ? ids.description : undefined,
        ref: (node: HTMLElement | null) => {
          service.refs.content = node;
        },
      }),
    getTitleProps: () =>
      normalize.element({
        ...popoverAnatomy.title.attrs(),
        id: ids.title,
      }),
    getDescriptionProps: () =>
      normalize.element({
        ...popoverAnatomy.description.attrs(),
        id: ids.description,
      }),
    getCloseProps: () =>
      normalize.button({
        ...popoverAnatomy.close.attrs(),
        id: ids.close,
        type: "button",
        onClick: () => {
          service.send({ type: "CLOSE" });
        },
      }),
  };
}
