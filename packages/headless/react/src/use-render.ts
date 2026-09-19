"use client";

import {
  cloneElement,
  createElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { mergeProps } from "./merge-props";
import { omitNativeButtonAttrs } from "./omit-native-button-attrs";

export type RenderProp<TState = Record<string, unknown>> =
  | ReactElement
  | ((props: Record<string, unknown>, state: TState) => ReactElement);

export type WithRender<T = object, TState = Record<string, unknown>> = T & {
  render?: RenderProp<TState>;
};

export interface UseRenderOptions<TState = Record<string, unknown>> {
  defaultTagName: string;
  render?: RenderProp<TState>;
  props: Record<string, unknown>;
  state?: TState;
}

function withoutNativeButtonAttrs(element: ReactElement): ReactElement {
  if (element.type !== "a") return element;
  const { children, ...rest } = omitNativeButtonAttrs({
    ...((element.props ?? {}) as Record<string, unknown>),
  });
  return createElement("a", rest, children as ReactNode);
}

export function useRender<TState = Record<string, unknown>>({
  defaultTagName,
  render,
  props,
  state,
}: UseRenderOptions<TState>): ReactElement {
  if (typeof render === "function") {
    return withoutNativeButtonAttrs(render(props, (state ?? {}) as TState));
  }

  if (render != null) {
    if (!isValidElement(render)) {
      throw new Error("[kimak] `render` expects a React element or a function");
    }
    const element = render as ReactElement<Record<string, unknown>>;
    return withoutNativeButtonAttrs(
      cloneElement(element, mergeProps(props, element.props ?? {})),
    );
  }

  return createElement(defaultTagName, props);
}
