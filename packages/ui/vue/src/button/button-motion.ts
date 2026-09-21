import type {
  AnimateButtonOptions,
  ButtonMotion,
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
  if (typeof window === "undefined" || !el || options.motion === "none") {
    return undefined;
  }

  let inner: ButtonMotion | undefined;
  let cancelled = false;

  void loadMotionGsap()
    .then(({ animateButton }) => {
      if (cancelled || !el.isConnected) return;
      inner = animateButton(el, options);
    })
    .catch(() => undefined);

  return {
    press(root) {
      inner?.press(root);
    },
    release(root) {
      inner?.release(root);
    },
    revert() {
      cancelled = true;
      inner?.revert();
      inner = undefined;
    },
  };
}

// Dynamic import: a static GSAP import would land in the Button chunk even for motion="none".
function loadMotionGsap(): Promise<typeof import("@kimak/motion-gsap")> {
  return import("@kimak/motion-gsap");
}
