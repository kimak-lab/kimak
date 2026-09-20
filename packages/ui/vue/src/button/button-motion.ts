import {
  animateButton,
  type AnimateButtonOptions,
  type ButtonMotion,
} from "@kimak/motion-gsap";

export function hostElement(value: unknown): HTMLElement | null {
  if (value instanceof HTMLElement) return value;
  if (value && typeof value === "object" && "$el" in value) {
    const el = (value as { $el: unknown }).$el;
    return el instanceof HTMLElement ? el : null;
  }
  return null;
}

export function bindButtonMotion(
  el: HTMLElement | null,
  options: AnimateButtonOptions = {},
): ButtonMotion | undefined {
  if (!el || options.motion === "none") return undefined;
  return animateButton(el, options);
}
