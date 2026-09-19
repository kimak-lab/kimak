"use client";

import { useEffect, useRef, type RefObject } from "react";
import { animateButton } from "@kimak/motion-gsap";

export function useButtonMotion(): RefObject<HTMLButtonElement | null> {
  const motionRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const node = motionRef.current;
    if (!node) return undefined;
    const motion = animateButton(node);
    return () => motion.revert();
  }, []);

  return motionRef;
}
