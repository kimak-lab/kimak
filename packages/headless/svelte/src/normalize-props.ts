import { createNormalizer, type Dict } from "@kimak/core";

export interface SveltePropTypes {
  element: Record<string, unknown>;
  button: Record<string, unknown>;
  label: Record<string, unknown>;
  input: Record<string, unknown>;
}

function toSvelteEventKey(key: string): string | null {
  if (!key.startsWith("on") || key.length < 3) return null;
  return `on${key.slice(2).toLowerCase()}`;
}

function remapReactDialect(props: Dict): Dict {
  const next: Dict = { ...props };

  if ("htmlFor" in next) {
    next.for = next.htmlFor;
    delete next.htmlFor;
  }

  if ("className" in next) {
    next.class = next.className;
    delete next.className;
  }

  for (const key of Object.keys(next)) {
    const svelteKey = toSvelteEventKey(key);
    if (svelteKey && svelteKey !== key) {
      next[svelteKey] = next[key];
      delete next[key];
    }
  }

  return next;
}

export const normalizeProps = createNormalizer<SveltePropTypes>(remapReactDialect);
