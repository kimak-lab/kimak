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

function toCssProperty(key: string): string {
  if (key.startsWith("--")) return key;
  return key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
}

/** Svelte spreads `style` as an attribute string, so serialize the object dialect. */
function toStyleString(style: Record<string, unknown>): string {
  const declarations: string[] = [];
  for (const [key, value] of Object.entries(style)) {
    if (value == null || value === "") continue;
    declarations.push(`${toCssProperty(key)}: ${String(value)}`);
  }
  return declarations.join("; ");
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

  if ("tabIndex" in next) {
    next.tabindex = next.tabIndex;
    delete next.tabIndex;
  }

  if (next.style && typeof next.style === "object") {
    next.style = toStyleString(next.style as Record<string, unknown>);
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
