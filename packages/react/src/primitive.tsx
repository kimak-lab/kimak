"use client";

import { createElement, type ReactNode } from "react";
import { Slot } from "./slot";

type PrimitiveTag = "button" | "div" | "span" | "label" | "input" | "p" | "h2";

type PrimitiveProps = Record<string, unknown> & {
  asChild?: boolean;
  children?: ReactNode;
};

function createPrimitive(tag: PrimitiveTag) {
  function Primitive({ asChild, ...props }: PrimitiveProps) {
    if (asChild) return <Slot {...props} />;
    return createElement(tag, props);
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
