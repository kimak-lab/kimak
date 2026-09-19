export const buttonVariants = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "link",
] as const;

export type ButtonVariant = (typeof buttonVariants)[number];

export const buttonSizes = [
  "xs",
  "sm",
  "md",
  "lg",
  "icon-xs",
  "icon-sm",
  "icon",
  "icon-lg",
] as const;

export type ButtonSize = (typeof buttonSizes)[number];

export interface ButtonAttrsInput {
  variant?: ButtonVariant;
  size?: ButtonSize;
  "data-variant"?: string;
  "data-size"?: string;
}

/**
 * Anatomy attrs for a Kimak button look target. Apply to a host `<button>` or
 * to an `<a>` styled as a button. Product `<Button>` `as="a"` also composes
 * onto a link when you need machine behavior.
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
