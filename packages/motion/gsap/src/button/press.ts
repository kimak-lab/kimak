import { gsap } from "gsap";
import { clearTransform, type MotionSession } from "./shared";

export function pressTransform(session: MotionSession, el: HTMLElement): void {
  if (session.reduceMotion()) return;
  const vars: gsap.TweenVars = {
    scale: session.pressScale,
    duration: session.duration,
    ease: session.ease,
    overwrite: "auto",
    transformOrigin: "50% 50%",
  };
  if (session.magneticPull === 0) vars.y = session.pressY;
  session.tween(el, vars);
}

export function restTransform(
  session: MotionSession,
  el: HTMLElement,
  hovered: boolean,
): void {
  if (session.reduceMotion()) {
    session.set(el, { scale: 1, x: 0, y: 0, clearProps: "transform" });
    return;
  }

  if (hovered && session.hoverY !== 0) {
    session.tween(el, {
      scale: session.hoverScale,
      y: session.hoverY,
      duration: session.duration,
      ease: session.ease,
      overwrite: "auto",
      transformOrigin: "50% 50%",
    });
    return;
  }

  if (hovered && session.magneticPull !== 0) {
    session.tween(el, {
      scale: 1,
      duration: session.duration,
      ease: session.releaseEase,
      overwrite: "auto",
      transformOrigin: "50% 50%",
    });
    return;
  }

  session.tween(el, {
    scale: 1,
    x: 0,
    y: 0,
    duration: session.duration,
    ease: session.releaseEase,
    overwrite: "auto",
    transformOrigin: "50% 50%",
    onComplete() {
      clearTransform(el);
    },
  });
}
