export function splitProps<T extends object>(
  props: T,
  keys: readonly string[],
): [Partial<T>, Partial<T>] {
  const source = { ...(props as Record<string, unknown>) };
  const picked: Record<string, unknown> = {};
  for (const key of keys) {
    if (key in source) {
      picked[key] = source[key];
      delete source[key];
    }
  }
  return [picked as Partial<T>, source as Partial<T>];
}
