export function splitProps<T extends object, const K extends readonly (keyof T)[]>(
  props: T,
  keys: K,
): [Pick<T, K[number]>, Omit<T, K[number]>] {
  const source = { ...(props as Record<string, unknown>) };
  const picked: Record<string, unknown> = {};
  for (const key of keys) {
    if (key in source) {
      picked[key as string] = source[key as string];
      delete source[key as string];
    }
  }
  return [picked as Pick<T, K[number]>, source as Omit<T, K[number]>];
}
