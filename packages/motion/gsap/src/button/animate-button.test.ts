import { buttonAnatomy } from "@kimak/spec";
import { gsap } from "gsap";
import { afterEach, describe, expect, it } from "vitest";
import { animateButton } from "./animate-button";
import { OVERLAY_ATTR } from "./shared";
import { buttonMotionVariants } from "./variants";

function makeButton(attrs: Record<string, string> = {}): HTMLButtonElement {
  const button = document.createElement("button");
  button.setAttribute("data-scope", "button");
  button.setAttribute("data-slot", "root");
  for (const [key, value] of Object.entries(attrs)) {
    button.setAttribute(key, value);
  }
  document.body.append(button);
  return button;
}

function scaleOf(el: Element): number {
  return Number(gsap.getProperty(el, "scale"));
}

function mockRect(el: HTMLElement, width = 100, height = 40): void {
  el.getBoundingClientRect = () =>
    ({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: width,
      bottom: height,
      width,
      height,
      toJSON() {
        return {};
      },
    }) as DOMRect;
}

describe("animateButton", () => {
  const handles: Array<{ revert: () => void }> = [];

  afterEach(() => {
    for (const handle of handles) handle.revert();
    handles.length = 0;
    document.body.replaceChildren();
  });

  it("targets buttonAnatomy root and scales on press, then restores", () => {
    const button = makeButton();
    expect(button.matches(buttonAnatomy.root.selector)).toBe(true);
    const motion = animateButton(button, { duration: 0, pressScale: 0.9 });
    handles.push(motion);

    motion.press(button);
    expect(scaleOf(button)).toBe(0.9);

    motion.release(button);
    expect(scaleOf(button)).toBe(1);
  });

  it("ignores press when data-disabled or data-loading", () => {
    const disabled = makeButton({ "data-disabled": "" });
    const loading = makeButton({ "data-loading": "" });
    const disabledMotion = animateButton(disabled, { duration: 0, pressScale: 0.9 });
    const loadingMotion = animateButton(loading, { duration: 0, pressScale: 0.9 });
    handles.push(disabledMotion, loadingMotion);

    disabledMotion.press(disabled);
    loadingMotion.press(loading);

    expect(scaleOf(disabled)).toBe(1);
    expect(scaleOf(loading)).toBe(1);
  });

  it("skips the tween when reduceMotion is set", () => {
    const button = makeButton();
    const motion = animateButton(button, {
      duration: 0,
      pressScale: 0.9,
      reduceMotion: true,
    });
    handles.push(motion);

    motion.press(button);
    expect(scaleOf(button)).toBe(1);
  });

  it("binds pointerdown on anatomy roots inside a scope", () => {
    const scope = document.createElement("div");
    const button = makeButton();
    const ignored = document.createElement("button");
    ignored.textContent = "plain";
    scope.append(button, ignored);
    document.body.append(scope);

    const motion = animateButton(scope, { duration: 0, pressScale: 0.9 });
    handles.push(motion);

    button.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, button: 0 }));
    expect(scaleOf(button)).toBe(0.9);
    expect(scaleOf(ignored)).toBe(1);
  });

  it("reverts tweens and listeners", () => {
    const button = makeButton();
    const motion = animateButton(button, { duration: 0, pressScale: 0.9 });
    motion.press(button);
    expect(scaleOf(button)).toBe(0.9);

    motion.revert();
    expect(scaleOf(button)).toBe(1);

    button.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, button: 0 }));
    expect(scaleOf(button)).toBe(1);
  });

  it("does not bind when motion is none", () => {
    const button = makeButton();
    const motion = animateButton(button, { motion: "none", duration: 0, pressScale: 0.9 });
    handles.push(motion);

    motion.press(button);
    button.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, button: 0 }));
    expect(scaleOf(button)).toBe(1);
  });

  it("uses named press recipes", () => {
    const soft = makeButton();
    const bounce = makeButton();
    const sink = makeButton();
    const softMotion = animateButton(soft, { motion: "soft", duration: 0 });
    const bounceMotion = animateButton(bounce, { motion: "bounce", duration: 0 });
    const sinkMotion = animateButton(sink, { motion: "sink", duration: 0 });
    handles.push(softMotion, bounceMotion, sinkMotion);

    softMotion.press(soft);
    bounceMotion.press(bounce);
    sinkMotion.press(sink);

    expect(scaleOf(soft)).toBe(0.99);
    expect(scaleOf(bounce)).toBe(0.94);
    expect(scaleOf(sink)).toBe(0.97);
    expect(Number(gsap.getProperty(sink, "y"))).toBe(2);

    sinkMotion.release(sink);
    expect(Number(gsap.getProperty(sink, "y"))).toBe(0);
  });

  it("lifts on pointerover and presses into the surface", () => {
    const button = makeButton();
    const motion = animateButton(button, { motion: "lift", duration: 0 });
    handles.push(motion);

    button.dispatchEvent(new PointerEvent("pointerover", { bubbles: true }));
    expect(Number(gsap.getProperty(button, "y"))).toBe(-2);
    expect(scaleOf(button)).toBe(1.02);

    motion.press(button);
    expect(scaleOf(button)).toBe(0.97);
    expect(Number(gsap.getProperty(button, "y"))).toBe(0);
  });

  it("spawns a ripple overlay from the pointer and removes it on revert", () => {
    const button = makeButton();
    mockRect(button);
    const motion = animateButton(button, { motion: "ripple", duration: 0 });
    handles.push(motion);

    button.dispatchEvent(
      new PointerEvent("pointerdown", { bubbles: true, button: 0, clientX: 20, clientY: 10 }),
    );
    const overlay = button.querySelector(`[${OVERLAY_ATTR}]`);
    expect(overlay).not.toBeNull();
    expect(overlay?.getAttribute("aria-hidden")).toBe("true");
    expect(scaleOf(button)).toBe(0.97);

    motion.revert();
    expect(button.querySelector(`[${OVERLAY_ATTR}]`)).toBeNull();
  });

  it("sweeps a shine overlay on pointerover", () => {
    const button = makeButton();
    const motion = animateButton(button, { motion: "shine", duration: 0 });
    handles.push(motion);

    button.dispatchEvent(new PointerEvent("pointerover", { bubbles: true }));
    expect(button.querySelector(`[${OVERLAY_ATTR}]`)).not.toBeNull();
    expect(button.querySelector("[data-kimak-shine]")).not.toBeNull();
  });

  it("pulls toward the pointer for magnetic and skips when reduceMotion", () => {
    const button = makeButton();
    mockRect(button);
    const motion = animateButton(button, { motion: "magnetic", duration: 0 });
    handles.push(motion);

    button.dispatchEvent(
      new PointerEvent("pointermove", {
        bubbles: true,
        clientX: 90,
        clientY: 5,
        pointerType: "mouse",
      }),
    );
    expect(Number(gsap.getProperty(button, "x"))).toBeGreaterThan(0);
    expect(Number(gsap.getProperty(button, "y"))).toBeLessThan(0);

    const quiet = makeButton();
    mockRect(quiet);
    const quietMotion = animateButton(quiet, {
      motion: "magnetic",
      duration: 0,
      reduceMotion: true,
    });
    handles.push(quietMotion);
    quiet.dispatchEvent(
      new PointerEvent("pointermove", {
        bubbles: true,
        clientX: 90,
        clientY: 5,
        pointerType: "mouse",
      }),
    );
    expect(Number(gsap.getProperty(quiet, "x"))).toBe(0);
  });

  it("lists every named motion variant", () => {
    expect(buttonMotionVariants).toEqual([
      "press",
      "soft",
      "bounce",
      "sink",
      "lift",
      "ripple",
      "magnetic",
      "shine",
      "none",
    ]);
  });
});
