export function prefersReducedMotion(override?: boolean): boolean {
  if (override != null) return override;
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
