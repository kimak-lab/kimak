"use client";

import { Button as Parts, type ButtonRootProps } from "@kimak/headless-react";

export type ButtonProps = ButtonRootProps;

function ButtonField({ children, ...props }: ButtonProps) {
  return (
    <Parts.Root {...props}>
      {children}
      <Parts.Indicator />
    </Parts.Root>
  );
}

export const Button = Object.assign(ButtonField, {
  Root: Parts.Root,
  Indicator: Parts.Indicator,
});
