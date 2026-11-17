/**
 * Anatomy attrs for a Kimak popover content look target. Apply to any element
 * that should look like popover content without the machine (e.g. a static card).
 */
export function popoverContentAttrs() {
  return {
    "data-scope": "popover",
    "data-slot": "content",
  } as const;
}
