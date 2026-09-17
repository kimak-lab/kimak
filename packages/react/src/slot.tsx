"use client";

import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { mergeProps } from "./merge-props";

export interface SlotProps {
  children?: ReactNode;
  [key: string]: unknown;
}

export function Slot({ children, ...props }: SlotProps) {
  const child = Children.only(children);
  if (!isValidElement(child)) {
    throw new Error("[kimak] asChild requires a single React element child");
  }
  const element = child as ReactElement<Record<string, unknown>>;
  return cloneElement(element, mergeProps(props, element.props ?? {}));
}
