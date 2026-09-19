export const buttonVariants = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "destructive",
] as const;

export type ButtonVariant = (typeof buttonVariants)[number];

export const buttonSizes = ["sm", "md", "lg"] as const;

export type ButtonSize = (typeof buttonSizes)[number];

export interface ButtonAttrsInput {
  variant?: ButtonVariant;
  size?: ButtonSize;
  "data-variant"?: string;
  "data-size"?: string;
}

/**
 * Anatomy attrs for a Kimak button look target. Apply to a host `<button>` or
 * to an `<a>` styled as a button — do not render `<Button>` as a link.
 */
export function buttonAttrs(input: ButtonAttrsInput = {}) {
  const dataVariant = input["data-variant"] ?? input.variant;
  const dataSize = input["data-size"] ?? input.size;
  return {
    "data-scope": "button",
    "data-slot": "root",
    ...(dataVariant ? { "data-variant": dataVariant } : {}),
    ...(dataSize ? { "data-size": dataSize } : {}),
  };
}
