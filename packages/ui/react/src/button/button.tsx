"use client";

import { Button as Parts, mergeProps, type ButtonRootProps } from "@kimak/headless-react";
import type { ButtonMotionVariant } from "@kimak/motion-gsap";
import { buttonAttrs, type ButtonSize, type ButtonVariant } from "./button-attrs";
import { useButtonMotion } from "./button-motion";

export type { ButtonMotionVariant };

export interface ButtonProps extends ButtonRootProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  motion?: ButtonMotionVariant;
}

function ButtonField({ children, variant, size, motion = "press", ...props }: ButtonProps) {
  const motionRef = useButtonMotion(motion);
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
