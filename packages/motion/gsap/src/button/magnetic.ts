import type { MotionSession } from "./shared";

export function moveMagnetic(
  session: MotionSession,
  el: HTMLElement,
  event: PointerEvent,
): void {
  if (session.reduceMotion() || session.magneticPull === 0) return;
  if (event.pointerType && event.pointerType !== "mouse") return;
  const rect = el.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return;
  const dx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
  const dy = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
  const nx = Math.max(-1, Math.min(1, dx));
  const ny = Math.max(-1, Math.min(1, dy));
  session.tween(el, {
    x: nx * session.magneticPull,
    y: ny * session.magneticPull,
    duration: session.duration,
    ease: session.ease,
    overwrite: "auto",
  });
}
