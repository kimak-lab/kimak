const NATIVE_BUTTON_KEYS = ["type", "name", "value", "form", "disabled"] as const;

export function omitNativeButtonAttrs<T extends Record<string, unknown>>(props: T): T {
  const next = { ...props };
  for (const key of NATIVE_BUTTON_KEYS) {
    delete next[key];
  }
  return next;
}
