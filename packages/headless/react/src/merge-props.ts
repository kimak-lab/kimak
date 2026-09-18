import { mergeProps as mergeCoreProps, type Dict } from "@kimak/core";

type PossibleRef<T> = ((node: T) => void) | { current: T | null } | null | undefined;

export function composeRefs<T>(...refs: PossibleRef<T>[]) {
  return (node: T) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    }
  };
}

export function mergeProps(...bags: Array<object | undefined>): Dict {
  const dicts = bags.filter((bag) => bag != null) as Dict[];
  const refs = dicts
    .map((bag) => bag.ref)
    .filter((ref): ref is PossibleRef<unknown> => ref != null);
  const merged: Dict = mergeCoreProps(...dicts);
  if (refs.length > 1) {
    merged.ref = composeRefs(...refs);
  }
  return merged;
}
