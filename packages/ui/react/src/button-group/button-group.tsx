"use client";

import { mergeProps } from "@kimak/headless-react";
import type { ComponentProps } from "react";
import { buttonGroupAttrs, type ButtonGroupOrientation } from "./button-group-attrs";

export interface ButtonGroupProps extends ComponentProps<"div"> {
  orientation?: ButtonGroupOrientation;
}

export function ButtonGroup({ orientation, ...props }: ButtonGroupProps) {
  return <div {...mergeProps(buttonGroupAttrs({ orientation }), props)} />;
}
