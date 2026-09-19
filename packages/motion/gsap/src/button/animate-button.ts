import { buttonAnatomy } from "@kimak/spec";
import { gsap } from "gsap";
import { prefersReducedMotion } from "../reduced-motion";

const ROOT_SELECTOR = buttonAnatomy.root.selector;

export interface AnimateButtonOptions {
  /** Pressed scale. Transform only; default 0.97. */
  pressScale?: number;
  /** Seconds for press and release. Default 0.16. */
  duration?: number;
  /** GSAP ease. Default "power2.out". */
  ease?: string;
  /** When set, skips matchMedia and uses this value. */
  reduceMotion?: boolean;
}

export interface ButtonMotion {
  press: (root?: Element) => void;
  release: (root?: Element) => void;
  revert: () => void;
}

function noopMotion(): ButtonMotion {
  return {
    press() {},
    release() {},
    revert() {},
  };
}

function isButtonRoot(node: Element): node is HTMLElement {
  return node instanceof HTMLElement && node.matches(ROOT_SELECTOR);
}

function findButtonRoot(node: EventTarget | null, scope: Element): HTMLElement | null {
  if (!(node instanceof Element)) return null;
  const root = node.closest(ROOT_SELECTOR);
  if (!root || !isButtonRoot(root)) return null;
  if (root !== scope && !scope.contains(root)) return null;
  return root;
}

function isInert(root: Element): boolean {
  return (
    root.hasAttribute("data-disabled") ||
    root.hasAttribute("data-loading") ||
    (root instanceof HTMLButtonElement && root.disabled)
  );
}

function isActivateKey(event: KeyboardEvent): boolean {
  return event.key === "Enter" || event.key === " ";
}

/**
 * Bind interruptible press scale to a Kimak button root, or every button root
 * inside a scope. Targets `buttonAnatomy` selectors. Call from the client after mount.
 */
export function animateButton(
  scope: Element,
  options: AnimateButtonOptions = {},
): ButtonMotion {
  if (typeof window === "undefined") return noopMotion();

  const pressScale = options.pressScale ?? 0.97;
  const duration = options.duration ?? 0.16;
  const ease = options.ease ?? "power2.out";
  const reduceMotionLocked = options.reduceMotion;
  let reduceMotion = prefersReducedMotion(reduceMotionLocked);

  const mm = gsap.matchMedia();
  if (reduceMotionLocked == null) {
    mm.add("(prefers-reduced-motion: reduce)", () => {
      reduceMotion = true;
      return () => {
        reduceMotion = prefersReducedMotion();
      };
    });
  }

  const ctx = gsap.context(() => undefined, scope);
  let active: HTMLElement | null = null;

  function tween(target: Element, vars: gsap.TweenVars): void {
    ctx.add(() => {
      gsap.to(target, vars);
    });
  }

  function press(root?: Element): void {
    const el = root ? findButtonRoot(root, scope) : isButtonRoot(scope) ? scope : null;
    if (!el || isInert(el) || reduceMotion) return;
    active = el;
    tween(el, {
      scale: pressScale,
      duration,
      ease,
      overwrite: "auto",
      transformOrigin: "50% 50%",
    });
  }

  function release(root?: Element): void {
    const el =
      (root ? findButtonRoot(root, scope) : null) ??
      (active && (active === scope || scope.contains(active)) ? active : null) ??
      (isButtonRoot(scope) ? scope : null);
    if (!el) return;
    if (active === el) active = null;
    if (reduceMotion) {
      ctx.add(() => {
        gsap.set(el, { scale: 1, clearProps: "transform" });
      });
      return;
    }
    tween(el, {
      scale: 1,
      duration,
      ease,
      overwrite: "auto",
      onComplete() {
        gsap.set(el, { clearProps: "transform" });
      },
    });
  }

  function onPointerDown(event: Event): void {
    if (!(event instanceof PointerEvent) || event.button !== 0) return;
    const root = findButtonRoot(event.target, scope);
    if (!root) return;
    press(root);
    if (active !== root) return;
    try {
      root.setPointerCapture(event.pointerId);
    } catch {
      // jsdom and some hosts omit pointer capture.
    }
  }

  function onPointerRelease(event: Event): void {
    const target = event.target instanceof Element ? event.target : active;
    release(target ?? undefined);
  }

  function onKeyDown(event: Event): void {
    if (!(event instanceof KeyboardEvent) || event.repeat || !isActivateKey(event)) return;
    press(event.target instanceof Element ? event.target : undefined);
  }

  function onKeyUp(event: Event): void {
    if (!(event instanceof KeyboardEvent) || !isActivateKey(event)) return;
    const target = event.target instanceof Element ? event.target : active;
    if (!target) return;
    release(target);
  }

  function onBlur(event: Event): void {
    const target = event.target instanceof Element ? event.target : active;
    if (!target) return;
    release(target);
  }

  scope.addEventListener("pointerdown", onPointerDown);
  scope.addEventListener("pointerup", onPointerRelease);
  scope.addEventListener("pointercancel", onPointerRelease);
  scope.addEventListener("lostpointercapture", onPointerRelease);
  scope.addEventListener("keydown", onKeyDown);
  scope.addEventListener("keyup", onKeyUp);
  scope.addEventListener("blur", onBlur, true);

  return {
    press,
    release,
    revert() {
      scope.removeEventListener("pointerdown", onPointerDown);
      scope.removeEventListener("pointerup", onPointerRelease);
      scope.removeEventListener("pointercancel", onPointerRelease);
      scope.removeEventListener("lostpointercapture", onPointerRelease);
      scope.removeEventListener("keydown", onKeyDown);
      scope.removeEventListener("keyup", onKeyUp);
      scope.removeEventListener("blur", onBlur, true);
      active = null;
      ctx.revert();
      mm.revert();
    },
  };
}
