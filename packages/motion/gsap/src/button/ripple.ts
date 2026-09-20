import { ensureOverlay, type MotionSession } from "./shared";

export function spawnRipple(session: MotionSession, root: HTMLElement, event?: Event): void {
  if (session.reduceMotion()) return;
  const overlay = ensureOverlay(root);
  const rect = overlay.getBoundingClientRect();
  let x = rect.width / 2;
  let y = rect.height / 2;
  if (event instanceof PointerEvent) {
    x = event.clientX - rect.left;
    y = event.clientY - rect.top;
  }
  const size = Math.max(rect.width, rect.height, 1) * 2;
  const circle = document.createElement("span");
  circle.style.position = "absolute";
  circle.style.left = `${x}px`;
  circle.style.top = `${y}px`;
  circle.style.width = `${size}px`;
  circle.style.height = `${size}px`;
  circle.style.marginLeft = `${-size / 2}px`;
  circle.style.marginTop = `${-size / 2}px`;
  circle.style.borderRadius = "50%";
  circle.style.background = "currentColor";
  circle.style.opacity = "0.18";
  circle.style.pointerEvents = "none";
  overlay.append(circle);

  session.fromTo(
    circle,
    { scale: 0.05, opacity: 0.18 },
    {
      scale: 1,
      opacity: 0,
      duration: session.duration === 0 ? 0 : Math.max(session.duration, 0.45),
      ease: "power2.out",
      onComplete() {
        circle.remove();
      },
    },
  );
}
