"use client";

import { Button as Parts, mergeProps, type ButtonRootProps } from "@kimak/headless-react";
import { buttonAttrs, type ButtonSize, type ButtonVariant } from "./button-attrs";
import { useButtonMotion } from "./button-motion";

export interface ButtonProps extends ButtonRootProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

function ButtonField({ children, variant, size, ...props }: ButtonProps) {
  const motionRef = useButtonMotion();
  const look = buttonAttrs({ variant, size });

  return (
    <Parts.Root {...mergeProps(look, props, { ref: motionRef })}>
      {children}
      <Parts.Indicator />
    </Parts.Root>
  );
}

export const Button = Object.assign(ButtonField, {
  Root: Parts.Root,
  Indicator: Parts.Indicator,
});
