import { getLogicalNav } from "./direction";
import type { Direction } from "../types";

export interface RovingFocusOptions {
  current: string | null;
  items: readonly string[];
  loop?: boolean;
  dir?: Direction;
  orientation?: "horizontal" | "vertical" | "both";
}

export function getNextRovingId(
  options: RovingFocusOptions,
  key: string,
): string | null {
  const { current, items, loop = true, dir = "ltr", orientation = "horizontal" } = options;
  if (items.length === 0) return null;

  const index = current ? items.indexOf(current) : -1;
  const last = items.length - 1;

  const move = (delta: number) => {
    if (index < 0) return items[0] ?? null;
    const nextIndex = index + delta;
    if (nextIndex < 0) return loop ? (items[last] ?? null) : (items[0] ?? null);
    if (nextIndex > last) return loop ? (items[0] ?? null) : (items[last] ?? null);
    return items[nextIndex] ?? null;
  };

  if (key === "Home") return items[0] ?? null;
  if (key === "End") return items[last] ?? null;

  const logical = getLogicalNav(key, dir);
  if (logical && (orientation === "horizontal" || orientation === "both")) {
    return move(logical === "next" ? 1 : -1);
  }
  if (key === "ArrowDown" && (orientation === "vertical" || orientation === "both")) {
    return move(1);
  }
  if (key === "ArrowUp" && (orientation === "vertical" || orientation === "both")) {
    return move(-1);
  }
  return null;
}
