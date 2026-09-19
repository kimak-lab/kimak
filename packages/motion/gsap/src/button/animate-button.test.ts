import { buttonAnatomy } from "@kimak/spec";
import { gsap } from "gsap";
import { afterEach, describe, expect, it } from "vitest";
import { animateButton } from "./animate-button";

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
});
