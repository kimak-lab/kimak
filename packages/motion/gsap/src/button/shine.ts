import { ensureOverlay, type MotionSession } from "./shared";

const SHINE_ATTR = "data-kimak-shine";

function ensureShineBar(overlay: HTMLElement, session: MotionSession): HTMLElement {
  const existing = overlay.querySelector(`[${SHINE_ATTR}]`);
  if (existing instanceof HTMLElement) return existing;
  const bar = document.createElement("span");
  bar.setAttribute(SHINE_ATTR, "");
  bar.style.position = "absolute";
  bar.style.top = "0";
  bar.style.bottom = "0";
  bar.style.width = "45%";
  bar.style.background = "linear-gradient(90deg, transparent, currentColor, transparent)";
  bar.style.opacity = "0.2";
  bar.style.pointerEvents = "none";
  overlay.append(bar);
  session.set(bar, { xPercent: -120 });
  return bar;
}

export function playShine(session: MotionSession, root: HTMLElement): void {
  if (session.reduceMotion()) return;
  const overlay = ensureOverlay(root);
  const bar = ensureShineBar(overlay, session);
  session.fromTo(
    bar,
    { xPercent: -120 },
    {
      xPercent: 220,
      duration: session.duration === 0 ? 0 : Math.max(session.duration, 0.65),
      ease: "power2.inOut",
      overwrite: true,
    },
  );
}
