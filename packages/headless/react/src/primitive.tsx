"use client";

import type { ReactNode } from "react";
import { useRender, type RenderProp } from "./use-render";

type PrimitiveTag = "button" | "div" | "span" | "label" | "input" | "p" | "h2";

type PrimitiveProps = Record<string, unknown> & {
  render?: RenderProp;
  children?: ReactNode;
};

function createPrimitive(tag: PrimitiveTag) {
  function Primitive({ render, ...props }: PrimitiveProps) {
    return useRender({ defaultTagName: tag, render, props });
  }
  Primitive.displayName = `Primitive.${tag}`;
  return Primitive;
}

export const Primitive = {
  button: createPrimitive("button"),
  div: createPrimitive("div"),
  span: createPrimitive("span"),
  label: createPrimitive("label"),
  input: createPrimitive("input"),
  p: createPrimitive("p"),
  h2: createPrimitive("h2"),
};
