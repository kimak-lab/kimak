import type { Dict } from "./types";

function isPlainObject(value: unknown): value is Dict {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function compose<T extends unknown[]>(
  left?: (...args: T) => void,
  right?: (...args: T) => void,
): ((...args: T) => void) | undefined {
  if (left && right) {
    return (...args) => {
      left(...args);
      right(...args);
    };
  }
  return right ?? left;
}

export function mergeProps(...bags: Array<Dict | undefined>): Dict {
  const result: Dict = {};

  for (const bag of bags) {
    if (!bag) continue;
    for (const key of Object.keys(bag)) {
      const incoming = bag[key];
      const current = result[key];

      if (key === "class" || key === "className") {
        const joined = [current, incoming].filter(Boolean).join(" ");
        result[key] = joined || undefined;
        continue;
      }

      if (key === "style" && isPlainObject(current) && isPlainObject(incoming)) {
        result[key] = { ...current, ...incoming };
        continue;
      }

      if (typeof current === "function" && typeof incoming === "function") {
        result[key] = compose(
          current as (...args: unknown[]) => void,
          incoming as (...args: unknown[]) => void,
        );
        continue;
      }

      result[key] = incoming !== undefined ? incoming : current;
    }
  }

  return result;
}
