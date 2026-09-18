import type { Dict } from "@kimak/core";

export function omitRef(props: Dict): Dict {
  const { ref: _ref, ...rest } = props;
  return rest;
}

export function applyCallbackRef(node: Element | null, props: Dict): void {
  const ref = props.ref;
  if (typeof ref === "function") {
    ref(node);
  }
}
