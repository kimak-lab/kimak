import { gsap } from "gsap";
import { prefersReducedMotion } from "../reduced-motion";
import { pressTransform, restTransform } from "./press";
import { enterLift } from "./lift";
import { moveMagnetic } from "./magnetic";
import { spawnRipple } from "./ripple";
import {
  findButtonRoot,
  isActivateKey,
  isButtonRoot,
  isInert,
  noopMotion,
  removeOverlays,
  stillInsideRoot,
  type ButtonMotion,
  type MotionSession,
} from "./shared";
import { playShine } from "./shine";
import {
  motionNeedsHover,
  resolveMotionPreset,
  type ButtonMotionVariant,
} from "./variants";

export type { ButtonMotion };

export interface AnimateButtonOptions {
  /** Named press / hover / overlay recipe. Default "press". */
  motion?: ButtonMotionVariant;
  /** Pressed scale. Transform only; default follows the named motion. */
  pressScale?: number;
  /** Seconds for press, release, and hover. Default follows the named motion. */
  duration?: number;
  /** GSAP ease. Default "power2.out". Bounce keeps back.out on release. */
  ease?: string;
  /** When set, skips matchMedia and uses this value. */
  reduceMotion?: boolean;
}

/**
 * Bind interruptible button motion to a Kimak button root, or every button root
 * inside a scope. Targets `buttonAnatomy` selectors. Call from the client after mount.
 */
export function animateButton(
  scope: Element,
  options: AnimateButtonOptions = {},
): ButtonMotion {
  if (typeof window === "undefined") return noopMotion();

  const motion = options.motion ?? "press";
  if (motion === "none") return noopMotion();

  const preset = resolveMotionPreset(motion, options);
  const reduceMotionLocked = options.reduceMotion;
  let reduceMotion = prefersReducedMotion(reduceMotionLocked);
  const hover = motionNeedsHover(motion);

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
  const hovered = new Set<HTMLElement>();

  const session: MotionSession = {
    motion,
    ...preset,
    tween(target, vars) {
      ctx.add(() => {
        gsap.to(target, vars);
      });
    },
    fromTo(target, fromVars, toVars) {
      ctx.add(() => {
        gsap.fromTo(target, fromVars, toVars);
      });
    },
    set(target, vars) {
      ctx.add(() => {
        gsap.set(target, vars);
      });
    },
    reduceMotion() {
      return reduceMotion;
    },
  };

  function press(root?: Element, event?: Event): void {
    const el = root ? findButtonRoot(root, scope) : isButtonRoot(scope) ? scope : null;
    if (!el || isInert(el) || reduceMotion) return;
    active = el;
    pressTransform(session, el);
    if (motion === "ripple") spawnRipple(session, el, event);
  }

  function release(root?: Element): void {
    const el =
      (root ? findButtonRoot(root, scope) : null) ??
      (active && (active === scope || scope.contains(active)) ? active : null) ??
      (isButtonRoot(scope) ? scope : null);
    if (!el) return;
    if (active === el) active = null;
    restTransform(session, el, hovered.has(el));
  }

  function hoverEnter(el: HTMLElement, event: PointerEvent): void {
    if (isInert(el) || reduceMotion) return;
    hovered.add(el);
    if (motion === "lift") enterLift(session, el);
    if (motion === "shine") playShine(session, el);
    if (motion === "magnetic") moveMagnetic(session, el, event);
  }

  function hoverLeave(el: HTMLElement): void {
    hovered.delete(el);
    if (active === el) return;
    restTransform(session, el, false);
  }

  function onPointerDown(event: Event): void {
    if (!(event instanceof PointerEvent) || event.button !== 0) return;
    const root = findButtonRoot(event.target, scope);
    if (!root) return;
    press(root, event);
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
    press(event.target instanceof Element ? event.target : undefined, event);
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

  function onPointerOver(event: Event): void {
    if (!(event instanceof PointerEvent)) return;
    const root = findButtonRoot(event.target, scope);
    if (!root || stillInsideRoot(root, event.relatedTarget)) return;
    hoverEnter(root, event);
  }

  function onPointerOut(event: Event): void {
    if (!(event instanceof PointerEvent)) return;
    const root = findButtonRoot(event.target, scope);
    if (!root || stillInsideRoot(root, event.relatedTarget)) return;
    hoverLeave(root);
  }

  function onPointerMove(event: Event): void {
    if (!(event instanceof PointerEvent) || motion !== "magnetic") return;
    const root = findButtonRoot(event.target, scope);
    if (!root || isInert(root)) return;
    hovered.add(root);
    moveMagnetic(session, root, event);
  }

  scope.addEventListener("pointerdown", onPointerDown);
  scope.addEventListener("pointerup", onPointerRelease);
  scope.addEventListener("pointercancel", onPointerRelease);
  scope.addEventListener("lostpointercapture", onPointerRelease);
  scope.addEventListener("keydown", onKeyDown);
  scope.addEventListener("keyup", onKeyUp);
  scope.addEventListener("blur", onBlur, true);
  if (hover) {
    scope.addEventListener("pointerover", onPointerOver);
    scope.addEventListener("pointerout", onPointerOut);
  }
  if (motion === "magnetic") {
    scope.addEventListener("pointermove", onPointerMove);
  }

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
      if (hover) {
        scope.removeEventListener("pointerover", onPointerOver);
        scope.removeEventListener("pointerout", onPointerOut);
      }
      if (motion === "magnetic") {
        scope.removeEventListener("pointermove", onPointerMove);
      }
      active = null;
      hovered.clear();
      removeOverlays(scope);
      ctx.revert();
      mm.revert();
    },
  };
}
