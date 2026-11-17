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
  // Svelte spreads `style` as a string; join strings so consumer styles
  // extend part styles (e.g. positioner placement) instead of replacing them.
  const styles = dicts
    .map((bag) => bag.style)
    .filter((style): style is string => typeof style === "string" && style.trim() !== "");
  if (styles.length > 1) {
    merged.style = styles.map((style) => style.trim().replace(/;$/, "")).join("; ");
  }
  return merged;
}
