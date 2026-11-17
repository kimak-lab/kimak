"use client";

import {
  Popover as Parts,
  Portal,
  type PopoverContentProps as PartsContentProps,
  type PopoverPositionerProps,
} from "@kimak/headless-react";

export interface PopoverContentProps extends PartsContentProps {
  /**
   * Render into a portal so the content escapes clipping ancestors.
   * @default true
   */
  portalled?: boolean;
  /** Portal target. Defaults to `document.body`. */
  container?: HTMLElement | null;
  /** Props forwarded to the positioner wrapper. */
  positionerProps?: Omit<PopoverPositionerProps, "forceMount">;
}

/** Portal + Positioner + Content in one part. */
function Content({
  portalled = true,
  container,
  positionerProps,
  forceMount,
  ...props
}: PopoverContentProps) {
  const tree = (
    <Parts.Positioner forceMount={forceMount} {...positionerProps}>
      <Parts.Content forceMount={forceMount} {...props} />
    </Parts.Positioner>
  );
  return portalled ? <Portal container={container}>{tree}</Portal> : tree;
}

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
} from "@kimak/headless-react";
