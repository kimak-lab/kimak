"use client";

import {
  createContext,
  useContext,
  useEffect,
  useId,
  type ComponentProps,
  type ReactNode,
} from "react";
import {
  addDismissLayer,
  connectDialog,
  createDialogMachine,
  focusFirst,
  handleEscapeKey,
  handleInteractOutside,
  lockScroll,
  splitProps,
  type DialogApi,
  type DialogProps as CoreDialogProps,
  type Direction,
} from "@kimak/core";
import { useDirection } from "../direction";
import { mergeProps } from "../merge-props";
import { normalizeProps, type ReactPropTypes } from "../normalize-props";
import { Portal as KimakPortal } from "../portal";
import { Presence } from "../presence";
import { Primitive } from "../primitive";
import { useMachine } from "../use-machine";
import type { WithRender } from "../use-render";

type ReactDialogApi = DialogApi<ReactPropTypes>;

interface DialogContextValue {
  api: ReactDialogApi;
  forceMount: boolean;
}

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialogContext(): DialogContextValue {
  const value = useContext(DialogContext);
  if (!value) {
    throw new Error("[kimak] Dialog parts must be wrapped in Dialog.Root");
  }
  return value;
}

const MACHINE_KEYS = [
  "open",
  "defaultOpen",
  "modal",
  "closeOnEscape",
  "closeOnInteractOutside",
  "forceMount",
  "disabled",
  "role",
  "dir",
  "ids",
  "onOpenChange",
] as const;

export interface DialogRootProps
  extends Omit<ComponentProps<"div">, "dir" | "role" | "color">, CoreDialogProps, WithRender {
  children?: ReactNode;
}

function Root({ children, render, id, ...props }: DialogRootProps) {
  const reactId = useId();
  const [machineProps, rest] = splitProps(props, MACHINE_KEYS);
  const dir = useDirection(machineProps.dir as Direction | undefined);
  const service = useMachine(createDialogMachine, {
    ...(machineProps as CoreDialogProps),
    dir,
    id: id ?? reactId,
  });
  const api = connectDialog(service, normalizeProps);
  const merged = mergeProps(api.getRootProps(), rest);
  const modal = machineProps.modal !== false;

  useEffect(() => {
    if (!api.open) return undefined;

    const layerId = String(id ?? reactId);
    const removeLayer = addDismissLayer({
      id: layerId,
      closeOnEscape: machineProps.closeOnEscape,
      closeOnInteractOutside: machineProps.closeOnInteractOutside,
      onDismiss: () => service.send({ type: "CLOSE" }),
    });

    const onKeyDown = (event: KeyboardEvent) => {
      handleEscapeKey(event);
    };
    const onPointerDown = (event: PointerEvent) => {
      handleInteractOutside(event, service.refs.content ?? null);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    const unlock = modal ? lockScroll(document) : () => undefined;

    return () => {
      removeLayer();
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      unlock();
    };
  }, [
    api.open,
    id,
    machineProps.closeOnEscape,
    machineProps.closeOnInteractOutside,
    modal,
    reactId,
    service,
  ]);

  return (
    <DialogContext.Provider value={{ api, forceMount: Boolean(machineProps.forceMount) }}>
      <Primitive.div render={render} {...merged}>
        {children}
      </Primitive.div>
    </DialogContext.Provider>
  );
}

function Trigger(props: WithRender<ComponentProps<"button">>) {
  const { api } = useDialogContext();
  const { render, ...rest } = props;
  return <Primitive.button render={render} {...mergeProps(api.getTriggerProps(), rest)} />;
}

function Portal({
  children,
  container,
}: {
  children?: ReactNode;
  container?: HTMLElement | null;
}) {
  const { api, forceMount } = useDialogContext();
  return (
    <Presence present={api.open} forceMount={forceMount}>
      <KimakPortal container={container}>{children}</KimakPortal>
    </Presence>
  );
}

function Backdrop(props: WithRender<ComponentProps<"div">>) {
  const { api } = useDialogContext();
  const { render, ...rest } = props;
  return <Primitive.div render={render} {...mergeProps(api.getBackdropProps(), rest)} />;
}

function Positioner(props: WithRender<ComponentProps<"div">>) {
  const { api } = useDialogContext();
  const { render, ...rest } = props;
  return <Primitive.div render={render} {...mergeProps(api.getPositionerProps(), rest)} />;
}

function Content(props: WithRender<ComponentProps<"div">>) {
  const { api } = useDialogContext();
  const { render, children, ...rest } = props;
  const merged = mergeProps(api.getContentProps(), rest);

  useEffect(() => {
    if (!api.open) return undefined;
    const node = document.getElementById(String(merged.id ?? ""));
    if (node) focusFirst(node);
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    return () => {
      previous?.focus();
    };
  }, [api.open, merged.id]);

  return (
    <Primitive.div render={render} {...merged}>
      {children}
    </Primitive.div>
  );
}

function Title(props: WithRender<ComponentProps<"h2">>) {
  const { api } = useDialogContext();
  const { render, ...rest } = props;
  return <Primitive.h2 render={render} {...mergeProps(api.getTitleProps(), rest)} />;
}

function Description(props: WithRender<ComponentProps<"p">>) {
  const { api } = useDialogContext();
  const { render, ...rest } = props;
  return <Primitive.p render={render} {...mergeProps(api.getDescriptionProps(), rest)} />;
}

function Close(props: WithRender<ComponentProps<"button">>) {
  const { api } = useDialogContext();
  const { render, ...rest } = props;
  return <Primitive.button render={render} {...mergeProps(api.getCloseTriggerProps(), rest)} />;
}

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
