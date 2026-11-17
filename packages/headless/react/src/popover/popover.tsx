"use client";

import {
  createContext,
  useContext,
  useId,
  useLayoutEffect,
  type ComponentProps,
  type ReactNode,
} from "react";
import {
  connectPopover,
  createPopoverMachine,
  trackPopover,
  type PopoverApi,
  type PopoverProps as CorePopoverProps,
  type PopoverService,
} from "@kimak/core";
import { mergeProps } from "../merge-props";
import { normalizeProps, type ReactPropTypes } from "../normalize-props";
import { Presence } from "../presence";
import { Primitive } from "../primitive";
import { useDirection } from "../direction";
import { useMachine } from "../use-machine";
import type { WithRender } from "../use-render";

type ReactPopoverApi = PopoverApi<ReactPropTypes>;

interface PopoverContextValue {
  api: ReactPopoverApi;
  service: PopoverService;
}

const PopoverContext = createContext<PopoverContextValue | null>(null);

function usePopoverContext(): PopoverContextValue {
  const value = useContext(PopoverContext);
  if (!value) {
    throw new Error("[kimak] Popover parts must be wrapped in Popover.Root");
  }
  return value;
}

/** Read the popover api from inside `Popover.Root` (e.g. to close from custom content). */
export function usePopover(): ReactPopoverApi {
  return usePopoverContext().api;
}

export interface PopoverRootProps extends CorePopoverProps {
  children?: ReactNode;
}

function Root({ children, id, dir, ...props }: PopoverRootProps) {
  const reactId = useId();
  const resolvedDir = useDirection(dir);
  const service = useMachine(createPopoverMachine, {
    ...props,
    dir: resolvedDir,
    id: id ?? reactId,
  });
  const api = connectPopover(service, normalizeProps);

  return <PopoverContext.Provider value={{ api, service }}>{children}</PopoverContext.Provider>;
}

export type PopoverTriggerProps = WithRender<Omit<ComponentProps<"button">, "type">>;

function Trigger({ render, ...props }: PopoverTriggerProps) {
  const { api } = usePopoverContext();
  return <Primitive.button render={render} {...mergeProps(api.getTriggerProps(), props)} />;
}

export type PopoverPositionerProps = WithRender<ComponentProps<"div">> & {
  /** Keep the positioner and content mounted while closed. */
  forceMount?: boolean;
};

function Positioner({ render, forceMount, ...props }: PopoverPositionerProps) {
  const { api, service } = usePopoverContext();
  const open = api.open;

  useLayoutEffect(() => {
    if (!open) return undefined;
    return trackPopover(service);
  }, [open, service]);

  return (
    <Presence present={open} forceMount={forceMount}>
      <Primitive.div render={render} {...mergeProps(api.getPositionerProps(), props)} />
    </Presence>
  );
}

export type PopoverContentProps = WithRender<ComponentProps<"div">> & {
  /** Keep the content mounted while closed. */
  forceMount?: boolean;
};

function Content({ render, forceMount, ...props }: PopoverContentProps) {
  const { api } = usePopoverContext();
  return (
    <Presence present={api.open} forceMount={forceMount}>
      <Primitive.div render={render} {...mergeProps(api.getContentProps(), props)} />
    </Presence>
  );
}

export type PopoverTitleProps = WithRender<ComponentProps<"h2">>;

function Title({ render, ...props }: PopoverTitleProps) {
  const { api } = usePopoverContext();
  return <Primitive.h2 render={render} {...mergeProps(api.getTitleProps(), props)} />;
}

export type PopoverDescriptionProps = WithRender<ComponentProps<"p">>;

function Description({ render, ...props }: PopoverDescriptionProps) {
  const { api } = usePopoverContext();
  return <Primitive.p render={render} {...mergeProps(api.getDescriptionProps(), props)} />;
}

export type PopoverCloseProps = WithRender<Omit<ComponentProps<"button">, "type">>;

function Close({ render, ...props }: PopoverCloseProps) {
  const { api } = usePopoverContext();
  return <Primitive.button render={render} {...mergeProps(api.getCloseProps(), props)} />;
}

export const Popover = {
  Root,
  Trigger,
  Positioner,
  Content,
  Title,
  Description,
  Close,
};
