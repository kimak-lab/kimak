import { dialogAnatomy } from "@kimak/spec";
import { createIds } from "../platform/ids";
import { cycleTab } from "../platform/focus";
import { getPresenceState } from "../platform/presence";
import { dataIf } from "../types";
import type { DictPropTypes, NormalizeProps, PropTypes } from "../normalize";
import type { Service } from "../machine";
import type { DialogContext, DialogEvent, DialogProps } from "./dialog.types";

export interface DialogApi<T extends PropTypes = DictPropTypes> {
  open: boolean;
  setOpen: (open: boolean) => void;
  getRootProps: () => T["element"];
  getTriggerProps: () => T["button"];
  getBackdropProps: () => T["element"];
  getPositionerProps: () => T["element"];
  getContentProps: () => T["element"];
  getTitleProps: () => T["element"];
  getDescriptionProps: () => T["element"];
  getCloseTriggerProps: () => T["button"];
}

export function connectDialog<T extends PropTypes>(
  service: Service<DialogContext, DialogProps, DialogEvent>,
  normalize: NormalizeProps<T>,
): DialogApi<T> {
  const { props, context } = service.getSnapshot();
  const open = props.open ?? context.open;
  const modal = props.modal !== false;
  const dataState = getPresenceState(open);
  const role = props.role ?? "dialog";
  const baseId = props.id ?? "dialog";
  const ids = {
    ...createIds(baseId, dialogAnatomy.parts),
    ...props.ids,
  };

  return {
    open,
    setOpen: (next) => {
      service.send({ type: "SET_OPEN", open: next });
    },
    getRootProps: () =>
      normalize.element({
        ...dialogAnatomy.root.attrs(),
        "data-state": dataState,
        dir: props.dir ?? "ltr",
        id: ids.root,
      }),
    getTriggerProps: () =>
      normalize.button({
        ...dialogAnatomy.trigger.attrs(),
        id: ids.trigger,
        type: "button",
        disabled: props.disabled,
        "data-state": dataState,
        "data-disabled": dataIf(props.disabled),
        "aria-haspopup": "dialog",
        "aria-expanded": open,
        "aria-controls": ids.content,
        ref: (node: HTMLElement | null) => {
          service.refs.trigger = node;
        },
        onClick: () => {
          service.send({ type: "TOGGLE" });
        },
      }),
    getBackdropProps: () =>
      normalize.element({
        ...dialogAnatomy.backdrop.attrs(),
        id: ids.backdrop,
        "data-state": dataState,
      }),
    getPositionerProps: () =>
      normalize.element({
        ...dialogAnatomy.positioner.attrs(),
        id: ids.positioner,
        "data-state": dataState,
      }),
    getContentProps: () =>
      normalize.element({
        ...dialogAnatomy.content.attrs(),
        id: ids.content,
        role,
        tabIndex: -1,
        "data-state": dataState,
        "aria-modal": modal || undefined,
        "aria-labelledby": ids.title,
        "aria-describedby": ids.description,
        ref: (node: HTMLElement | null) => {
          service.refs.content = node;
        },
        onKeyDown: (event: KeyboardEvent) => {
          if (modal && event.key === "Tab") {
            const content = service.refs.content;
            if (content) cycleTab(content, event);
          }
        },
      }),
    getTitleProps: () =>
      normalize.element({
        ...dialogAnatomy.title.attrs(),
        id: ids.title,
      }),
    getDescriptionProps: () =>
      normalize.element({
        ...dialogAnatomy.description.attrs(),
        id: ids.description,
      }),
    getCloseTriggerProps: () =>
      normalize.button({
        ...dialogAnatomy.close.attrs(),
        type: "button",
        onClick: () => {
          service.send({ type: "CLOSE" });
        },
      }),
  };
}
