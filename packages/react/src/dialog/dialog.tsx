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
  type DialogApi,
  type DialogProps as CoreDialogProps,
  type Direction,
} from "@kimak/core";
import { useDirection } from "../direction";
import { mergeProps } from "../merge-props";
import { normalizeProps } from "../normalize-props";
import { Portal as KimakPortal } from "../portal";
import { Presence } from "../presence";
import { Primitive } from "../primitive";
import { splitProps } from "../split-props";
import { useMachine } from "../use-machine";

interface DialogContextValue {
  api: DialogApi;
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
  extends Omit<ComponentProps<"div">, "dir" | "role" | "color">, CoreDialogProps {
  asChild?: boolean;
  children?: ReactNode;
}

function Root({ children, asChild, id, ...props }: DialogRootProps) {
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
      <Primitive.div asChild={asChild} {...merged}>
        {children}
      </Primitive.div>
    </DialogContext.Provider>
  );
}

function Trigger({ asChild, ...props }: ComponentProps<"button"> & { asChild?: boolean }) {
  const { api } = useDialogContext();
  return <Primitive.button asChild={asChild} {...mergeProps(api.getTriggerProps(), props)} />;
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

function Backdrop({ asChild, ...props }: ComponentProps<"div"> & { asChild?: boolean }) {
  const { api } = useDialogContext();
  return <Primitive.div asChild={asChild} {...mergeProps(api.getBackdropProps(), props)} />;
}

function Positioner({ asChild, ...props }: ComponentProps<"div"> & { asChild?: boolean }) {
  const { api } = useDialogContext();
  return <Primitive.div asChild={asChild} {...mergeProps(api.getPositionerProps(), props)} />;
}

function Content({ asChild, children, ...props }: ComponentProps<"div"> & { asChild?: boolean }) {
  const { api } = useDialogContext();
  const merged = mergeProps(api.getContentProps(), props);

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
    <Primitive.div asChild={asChild} {...merged}>
      {children}
    </Primitive.div>
  );
}

function Title({ asChild, ...props }: ComponentProps<"h2"> & { asChild?: boolean }) {
  const { api } = useDialogContext();
  return <Primitive.h2 asChild={asChild} {...mergeProps(api.getTitleProps(), props)} />;
}

function Description({ asChild, ...props }: ComponentProps<"p"> & { asChild?: boolean }) {
  const { api } = useDialogContext();
  return <Primitive.p asChild={asChild} {...mergeProps(api.getDescriptionProps(), props)} />;
}

function Close({ asChild, ...props }: ComponentProps<"button"> & { asChild?: boolean }) {
  const { api } = useDialogContext();
  return <Primitive.button asChild={asChild} {...mergeProps(api.getCloseTriggerProps(), props)} />;
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
