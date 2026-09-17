import type { Dict } from "./types";

/**
 * Tags `connect()` knows how to emit. Add a key here when a new part needs a
 * different host element; adapters pick it up through `createNormalizer`.
 */
export const propTypeKeys = ["element", "button", "label", "input"] as const;

export type PropTypeKey = (typeof propTypeKeys)[number];

/**
 * Per-tag output bag. Adapters substitute framework vnode props
 * (`ReactPropTypes`, later Vue/Svelte).
 */
export type PropTypes = {
  [K in PropTypeKey]: unknown;
};

/** Untyped HTML bag used by core tests and identity normalize. */
export type DictPropTypes = Record<PropTypeKey, Dict>;

export type NormalizeFn<T = Dict> = (props: Dict) => T;

export type NormalizeProps<T extends PropTypes> = {
  [K in PropTypeKey]: (props: Dict) => T[K];
};

/**
 * `connect()` emits a React-shaped DOM dialect: `onClick`, `htmlFor`,
 * object `style`, and callback `ref`. Adapters remap those keys onto the host
 * vnode system. Look (`className`, tokens) does not belong here.
 */
export function createNormalizer<T extends PropTypes>(
  map: (props: Dict) => Dict = (props) => props,
): NormalizeProps<T> {
  const normalize = {} as NormalizeProps<T>;
  for (const key of propTypeKeys) {
    normalize[key] = map as NormalizeProps<T>[typeof key];
  }
  return normalize;
}

export const identityPropTypes: NormalizeProps<DictPropTypes> = createNormalizer();
