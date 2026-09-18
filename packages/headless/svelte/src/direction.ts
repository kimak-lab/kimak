import type { Direction } from "@kimak/core";
import { getContext, setContext } from "svelte";

const DirectionKey = Symbol("kimak-direction");

export function provideDirection(dir: Direction) {
  setContext(DirectionKey, dir);
}

export function useDirection(dir?: Direction): Direction {
  return dir ?? getContext<Direction>(DirectionKey) ?? "ltr";
}

export interface DirectionProviderProps {
  dir: Direction;
  children?: import("svelte").Snippet;
}

// Full provider component lands with compound parts; context helpers are ready now.
export const directionProviderStub = true;
