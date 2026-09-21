"use client";

import { Button as Parts, mergeProps, type ButtonRootProps } from "@kimak/headless-react";
import { buttonAttrs, type ButtonSize, type ButtonVariant } from "./button-attrs";

export interface ButtonProps extends ButtonRootProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

function ButtonField({ children, variant, size, ...props }: ButtonProps) {
  const look = buttonAttrs({ variant, size });

  return (
    <Parts.Root {...mergeProps(look, props)}>
      {children}
      <Parts.Indicator />
    </Parts.Root>
  );
}

export const Button = Object.assign(ButtonField, {
  Root: Parts.Root,
  Indicator: Parts.Indicator,
});
