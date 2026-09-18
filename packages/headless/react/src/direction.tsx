"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Direction } from "@kimak/core";

const DirectionContext = createContext<Direction>("ltr");

export function DirectionProvider({
  dir,
  children,
}: {
  dir: Direction;
  children: ReactNode;
}) {
  return <DirectionContext.Provider value={dir}>{children}</DirectionContext.Provider>;
}

export function useDirection(dir?: Direction): Direction {
  const context = useContext(DirectionContext);
  return dir ?? context;
}
