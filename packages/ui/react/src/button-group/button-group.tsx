"use client";

import { mergeProps, useRender, type RenderProp } from "@kimak/headless-react";
import type { ComponentProps } from "react";
import {
  buttonGroupAttrs,
  buttonGroupSeparatorAttrs,
  buttonGroupTextAttrs,
  type ButtonGroupOrientation,
} from "./button-group-attrs";

export interface ButtonGroupProps extends ComponentProps<"div"> {
  orientation?: ButtonGroupOrientation;
}

/** Groups related action buttons. Label it with `aria-label` or `aria-labelledby`. */
export function ButtonGroup({ orientation, ...props }: ButtonGroupProps) {
  return <div {...mergeProps(buttonGroupAttrs({ orientation }), { role: "group" }, props)} />;
}

export interface ButtonGroupSeparatorProps extends ComponentProps<"div"> {
  /** Defaults to `vertical`, the divider for a horizontal group. */
  orientation?: ButtonGroupOrientation;
}

export function ButtonGroupSeparator({ orientation = "vertical", ...props }: ButtonGroupSeparatorProps) {
  return (
    <div
      {...mergeProps(
        buttonGroupSeparatorAttrs({ orientation }),
        { role: "separator", "aria-orientation": orientation },
        props,
      )}
    />
  );
}

export interface ButtonGroupTextProps extends ComponentProps<"div"> {
  /** Replace the default `<div>`, e.g. `render={<label htmlFor="url" />}`. */
  render?: RenderProp;
}

export function ButtonGroupText({ render, ...props }: ButtonGroupTextProps) {
  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps(buttonGroupTextAttrs(), props),
  });
}
