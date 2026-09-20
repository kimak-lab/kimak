import type { MotionSession } from "./shared";

export function enterLift(session: MotionSession, el: HTMLElement): void {
  if (session.reduceMotion() || session.hoverY === 0) return;
  session.tween(el, {
    scale: session.hoverScale,
    y: session.hoverY,
    duration: session.duration,
    ease: session.ease,
    overwrite: "auto",
    transformOrigin: "50% 50%",
  });
}
