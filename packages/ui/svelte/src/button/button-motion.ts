import { animateButton, type ButtonMotion } from "@kimak/motion-gsap";

export type { ButtonMotion };

export function bindButtonMotion(node: HTMLElement | null): ButtonMotion | undefined {
  if (!node) return undefined;
  return animateButton(node);
}
