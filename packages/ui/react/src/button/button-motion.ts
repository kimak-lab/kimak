"use client";

import { useEffect, useRef, type RefObject } from "react";
import { animateButton, type ButtonMotionVariant } from "@kimak/motion-gsap";

export function useButtonMotion(
  motion: ButtonMotionVariant = "press",
): RefObject<HTMLButtonElement | null> {
  const motionRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const node = motionRef.current;
    if (!node || motion === "none") return undefined;
    const handle = animateButton(node, { motion });
    return () => handle.revert();
  }, [motion]);

  return motionRef;
}
