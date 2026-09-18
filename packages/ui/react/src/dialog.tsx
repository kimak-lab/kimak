"use client";

import type { ComponentProps } from "react";
import { Dialog as Parts } from "@kimak/headless-react";

type HeadlessContentProps = ComponentProps<typeof Parts.Content>;

export interface DialogContentProps extends HeadlessContentProps {
  container?: HTMLElement | null;
}

function Content({ container, ...props }: DialogContentProps) {
  return (
    <Parts.Portal container={container}>
      <Parts.Backdrop />
      <Parts.Positioner>
        <Parts.Content {...props} />
      </Parts.Positioner>
    </Parts.Portal>
  );
}

export const Dialog = {
  Root: Parts.Root,
  Trigger: Parts.Trigger,
  Portal: Parts.Portal,
  Backdrop: Parts.Backdrop,
  Positioner: Parts.Positioner,
  Content,
  Title: Parts.Title,
  Description: Parts.Description,
  Close: Parts.Close,
};
