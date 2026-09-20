import {
  animateButton,
  type AnimateButtonOptions,
  type ButtonMotion,
} from "@kimak/motion-gsap";

export type { ButtonMotion };

export function bindButtonMotion(
  node: HTMLElement | null,
  options: AnimateButtonOptions = {},
): ButtonMotion | undefined {
  if (!node || options.motion === "none") return undefined;
  return animateButton(node, options);
}
