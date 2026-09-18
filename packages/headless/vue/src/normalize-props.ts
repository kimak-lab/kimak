import { createNormalizer, type Dict } from "@kimak/core";

export interface VuePropTypes {
  element: Record<string, unknown>;
  button: Record<string, unknown>;
  label: Record<string, unknown>;
  input: Record<string, unknown>;
}

function toVueEventKey(key: string): string | null {
  if (!key.startsWith("on") || key.length < 3) return null;
  const type = key.slice(2);
  const first = type.charAt(0);
  if (!first) return null;
  return `on${first.toUpperCase()}${type.slice(1).toLowerCase()}`;
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
    const vueKey = toVueEventKey(key);
    if (vueKey && vueKey !== key) {
      next[vueKey] = next[key];
      delete next[key];
    }
  }

  return next;
}

export const normalizeProps = createNormalizer<VuePropTypes>(remapReactDialect);
