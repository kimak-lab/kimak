export function createId(prefix = "kimak"): string {
  const random =
    globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);
  return `${prefix}-${random}`;
}

export function createIds<const TParts extends readonly string[]>(
  id: string,
  parts: TParts,
): Record<TParts[number], string> {
  const ids = {} as Record<TParts[number], string>;
  for (const part of parts) {
    ids[part as TParts[number]] = `${id}:${part}`;
  }
  return ids;
}
