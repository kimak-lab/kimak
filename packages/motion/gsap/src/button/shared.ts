import { buttonAnatomy } from "@kimak/spec";
import { gsap } from "gsap";
import type { ButtonMotionVariant, MotionPreset } from "./variants";

export const ROOT_SELECTOR = buttonAnatomy.root.selector;
export const OVERLAY_ATTR = "data-kimak-overlay";

export interface ButtonMotion {
  press: (root?: Element) => void;
  release: (root?: Element) => void;
  revert: () => void;
}

export interface MotionSession extends MotionPreset {
  motion: ButtonMotionVariant;
  tween: (target: gsap.TweenTarget, vars: gsap.TweenVars) => void;
  fromTo: (target: gsap.TweenTarget, fromVars: gsap.TweenVars, toVars: gsap.TweenVars) => void;
  set: (target: gsap.TweenTarget, vars: gsap.TweenVars) => void;
  reduceMotion: () => boolean;
}

export function noopMotion(): ButtonMotion {
  return {
    press() {},
    release() {},
    revert() {},
  };
}

export function isButtonRoot(node: Element): node is HTMLElement {
  return node instanceof HTMLElement && node.matches(ROOT_SELECTOR);
}

export function findButtonRoot(node: EventTarget | null, scope: Element): HTMLElement | null {
  if (!(node instanceof Element)) return null;
  const root = node.closest(ROOT_SELECTOR);
  if (!root || !isButtonRoot(root)) return null;
  if (root !== scope && !scope.contains(root)) return null;
  return root;
}

export function isInert(root: Element): boolean {
  return (
    root.hasAttribute("data-disabled") ||
    root.hasAttribute("data-loading") ||
    (root instanceof HTMLButtonElement && root.disabled)
  );
}

export function isActivateKey(event: KeyboardEvent): boolean {
  return event.key === "Enter" || event.key === " ";
}

export function stillInsideRoot(root: HTMLElement, related: EventTarget | null): boolean {
  return related instanceof Node && root.contains(related);
}

export function ensureOverlay(root: HTMLElement): HTMLElement {
  const existing = root.querySelector(`:scope > [${OVERLAY_ATTR}]`);
  if (existing instanceof HTMLElement) return existing;
  const overlay = document.createElement("span");
  overlay.setAttribute(OVERLAY_ATTR, "");
  overlay.setAttribute("aria-hidden", "true");
  overlay.style.position = "absolute";
  overlay.style.inset = "0";
  overlay.style.overflow = "hidden";
  overlay.style.pointerEvents = "none";
  overlay.style.borderRadius = "inherit";
  root.append(overlay);
  return overlay;
}

export function removeOverlays(scope: Element): void {
  const overlays = isButtonRoot(scope)
    ? scope.querySelectorAll(`:scope > [${OVERLAY_ATTR}]`)
    : scope.querySelectorAll(`${ROOT_SELECTOR} > [${OVERLAY_ATTR}]`);
  for (const overlay of overlays) overlay.remove();
}

export function clearTransform(el: Element): void {
  gsap.set(el, { clearProps: "transform" });
}
