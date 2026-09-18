import type { Direction } from "@kimak/core";
import { getContext, setContext } from "svelte";

const DirectionKey = Symbol("kimak-direction");

export function provideDirection(dir: Direction | (() => Direction)) {
  setContext(DirectionKey, dir);
}

export function useDirection(dir?: Direction): Direction {
  const context = getContext<Direction | (() => Direction) | undefined>(DirectionKey);
  const resolved = typeof context === "function" ? context() : context;
  return dir ?? resolved ?? "ltr";
}

export interface DirectionProviderProps {
  dir: Direction;
  children?: import("svelte").Snippet;
}
