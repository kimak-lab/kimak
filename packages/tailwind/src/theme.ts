import type { CssInJs } from "./types";

export const t = {
  background: "var(--background)",
  foreground: "var(--foreground)",
  primary: "var(--primary)",
  primaryForeground: "var(--primary-foreground)",
  secondary: "var(--secondary)",
  secondaryForeground: "var(--secondary-foreground)",
  muted: "var(--muted)",
  mutedForeground: "var(--muted-foreground)",
  accent: "var(--accent)",
  accentForeground: "var(--accent-foreground)",
  destructive: "var(--destructive)",
  border: "var(--border)",
  input: "var(--input)",
  ring: "var(--ring)",
  popover: "var(--popover)",
  popoverForeground: "var(--popover-foreground)",
  radiusMd: "var(--radius-md)",
  radiusLg: "var(--radius-lg)",
} as const;

export function mix(color: string, percent: number): string {
  return `color-mix(in oklab, ${color} ${percent}%, transparent)`;
}

export function focusRing(color: string = t.ring): CssInJs {
  return {
    outline: "none",
    borderColor: color,
    boxShadow: `0 0 0 3px ${mix(color, 50)}`,
  };
}
