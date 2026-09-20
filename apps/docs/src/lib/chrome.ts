/** Docs chrome look for toggle groups: pressed = secondary, idle = outline. */

export const chromeIdleVariant = "outline" as const;
export const chromePressedVariant = "secondary" as const;

export function chromeToggleVariant(pressed: boolean) {
  return pressed ? chromePressedVariant : chromeIdleVariant;
}

export const articleCard =
  "min-w-0 rounded-[1.35rem] border border-border bg-docs-article shadow-[0_1px_0_color-mix(in_oklab,var(--foreground)_4%,transparent)]";

export const specTableWrap = "mb-6 overflow-x-auto rounded-lg border border-border";

export const specTable =
  "w-full border-collapse text-[0.9rem] [&_td]:border-b [&_th]:border-b [&_td]:border-border [&_th]:border-border [&_td]:px-[0.8rem] [&_th]:px-[0.8rem] [&_td]:py-[0.65rem] [&_th]:py-[0.65rem] [&_td]:text-left [&_th]:text-left [&_td]:align-top [&_th]:align-top [&_th]:bg-muted [&_th]:font-semibold [&_tr:last-child_td]:border-b-0 [&_tr:last-child_th]:border-b-0";
