export const buttonMotionVariants = [
  "press",
  "soft",
  "bounce",
  "sink",
  "lift",
  "ripple",
  "magnetic",
  "shine",
  "none",
] as const;

export type ButtonMotionVariant = (typeof buttonMotionVariants)[number];

export interface MotionPreset {
  pressScale: number;
  duration: number;
  ease: string;
  releaseEase: string;
  pressY: number;
  hoverScale: number;
  hoverY: number;
  magneticPull: number;
}

function assertNever(value: never): never {
  throw new Error(`Unhandled button motion: ${String(value)}`);
}

export function resolveMotionPreset(
  motion: ButtonMotionVariant,
  overrides: {
    pressScale?: number;
    duration?: number;
    ease?: string;
  } = {},
): MotionPreset {
  const preset: MotionPreset = {
    pressScale: 0.97,
    duration: 0.16,
    ease: "power2.out",
    releaseEase: "power2.out",
    pressY: 0,
    hoverScale: 1,
    hoverY: 0,
    magneticPull: 0,
  };

  switch (motion) {
    case "press":
    case "ripple":
    case "shine":
    case "none":
      break;
    case "soft":
      preset.pressScale = 0.99;
      preset.duration = 0.2;
      break;
    case "bounce":
      preset.pressScale = 0.94;
      preset.releaseEase = "back.out(1.7)";
      break;
    case "sink":
      preset.pressY = 2;
      break;
    case "lift":
      preset.hoverScale = 1.02;
      preset.hoverY = -2;
      break;
    case "magnetic":
      preset.magneticPull = 6;
      break;
    default:
      return assertNever(motion);
  }

  return {
    ...preset,
    pressScale: overrides.pressScale ?? preset.pressScale,
    duration: overrides.duration ?? preset.duration,
    ease: overrides.ease ?? preset.ease,
    releaseEase: motion === "bounce" ? preset.releaseEase : (overrides.ease ?? preset.releaseEase),
  };
}

export function motionNeedsHover(motion: ButtonMotionVariant): boolean {
  switch (motion) {
    case "lift":
    case "magnetic":
    case "shine":
      return true;
    case "press":
    case "soft":
    case "bounce":
    case "sink":
    case "ripple":
    case "none":
      return false;
    default:
      return assertNever(motion);
  }
}

export function motionNeedsOverlay(motion: ButtonMotionVariant): boolean {
  switch (motion) {
    case "ripple":
    case "shine":
      return true;
    case "press":
    case "soft":
    case "bounce":
    case "sink":
    case "lift":
    case "magnetic":
    case "none":
      return false;
    default:
      return assertNever(motion);
  }
}
