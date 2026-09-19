"use client";

import { mergeProps } from "@kimak/headless-react";
import type { ComponentProps } from "react";
import { spinnerAttrs } from "./spinner-attrs";

export type SpinnerProps = ComponentProps<"span">;

export function Spinner(props: SpinnerProps) {
  return <span {...mergeProps(spinnerAttrs(), { "aria-hidden": true }, props)} />;
}
