import type {
  AnimateButtonOptions,
  ButtonMotion,
  ButtonMotionVariant,
} from "@kimak/motion-gsap";

export type { ButtonMotion, ButtonMotionVariant };

export function bindButtonMotion(
  node: HTMLElement | null,
  options: AnimateButtonOptions = {},
): ButtonMotion | undefined {
  if (typeof window === "undefined" || !node || options.motion === "none") {
    return undefined;
  }

  let inner: ButtonMotion | undefined;
  let cancelled = false;

  void loadMotionGsap()
    .then(({ animateButton }) => {
      if (cancelled || !node.isConnected) return;
      inner = animateButton(node, options);
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
