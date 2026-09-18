"use client";

import type { ReactNode } from "react";
import { Checkbox as Parts, type CheckboxRootProps } from "@kimak/headless-react";

export interface CheckboxProps extends CheckboxRootProps {
  /** Replaces the default CSS check/dash from `@kimak/tailwind`. */
  indicator?: ReactNode;
}

function CheckboxField({ children, indicator, ...props }: CheckboxProps) {
  return (
    <Parts.Root {...props}>
      <Parts.Control>
        <Parts.Indicator>{indicator}</Parts.Indicator>
      </Parts.Control>
      {children != null ? <Parts.Label>{children}</Parts.Label> : null}
      <Parts.HiddenInput />
    </Parts.Root>
  );
}

export const Checkbox = Object.assign(CheckboxField, {
  Root: Parts.Root,
  Label: Parts.Label,
  Control: Parts.Control,
  Indicator: Parts.Indicator,
  HiddenInput: Parts.HiddenInput,
});
