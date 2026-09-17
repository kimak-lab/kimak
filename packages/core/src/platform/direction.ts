import type { Direction } from "../types";

export function getDirection(dir?: Direction, fallback: Direction = "ltr"): Direction {
  return dir ?? fallback;
}

export function getLogicalNav(
  key: string,
  dir: Direction,
): "next" | "prev" | null {
  if (key === "ArrowRight") return dir === "rtl" ? "prev" : "next";
  if (key === "ArrowLeft") return dir === "rtl" ? "next" : "prev";
  return null;
}
