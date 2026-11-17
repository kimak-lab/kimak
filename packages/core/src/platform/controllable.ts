export type EqualityFn<T> = (a: T, b: T) => boolean;

/**
 * Value a machine should render. `undefined` means uncontrolled; `null`,
 * `false`, and `0` are valid controlled values.
 */
export function resolveControllable<T>(controlled: T | undefined, uncontrolled: T): T {
  return controlled !== undefined ? controlled : uncontrolled;
}

export interface ControllableChange<T> {
  /** Controlled prop (`value`, `open`, `checked`). `undefined` when uncontrolled. */
  controlled: T | undefined;
  /** Value held in machine context. Seed it from `defaultValue` once, in `context(initial)`. */
  uncontrolled: T;
  next: T;
  onChange?: (value: T) => void;
  /** Defaults to `Object.is`. Pass a comparer for array or object values. */
  isEqual?: EqualityFn<T>;
}

/**
 * Request a value change from inside a machine reducer.
 *
 * - No-op when the resolved value already equals `next` (no callback).
 * - Otherwise calls `onChange(next)` before the snapshot updates.
 * - Controlled: the parent owns the value, so context does not change.
 * - Uncontrolled: returns `next` to store in context.
 *
 * Returns `uncontrolled` by reference when context must not change, so callers
 * can keep their context reference with `result === context.x`. Switching from
 * controlled to uncontrolled falls back to the last uncontrolled value.
 */
export function requestControllable<T>(change: ControllableChange<T>): T {
  const { controlled, uncontrolled, next, onChange, isEqual = Object.is } = change;
  if (isEqual(resolveControllable(controlled, uncontrolled), next)) return uncontrolled;
  onChange?.(next);
  if (controlled !== undefined || isEqual(uncontrolled, next)) return uncontrolled;
  return next;
}
