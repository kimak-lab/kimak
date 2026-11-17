import type { Direction } from "../types";

export type Side = "top" | "right" | "bottom" | "left";

export type Align = "start" | "center" | "end";

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface ComputePositionOptions {
  /** Trigger rect in viewport coordinates. */
  anchor: Rect;
  /** Floating element size. */
  floating: Size;
  /** Viewport size. */
  viewport: Size;
  side?: Side;
  align?: Align;
  /** Gap between anchor and floating element, in px. */
  sideOffset?: number;
  /** Minimum distance from the viewport edge, in px. */
  collisionPadding?: number;
  dir?: Direction;
}

export interface Position {
  x: number;
  y: number;
  side: Side;
  align: Align;
  availableWidth: number;
  availableHeight: number;
  anchorWidth: number;
  anchorHeight: number;
}

const opposite: Record<Side, Side> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

function isVertical(side: Side): boolean {
  switch (side) {
    case "top":
    case "bottom":
      return true;
    case "left":
    case "right":
      return false;
    default: {
      const exhaustive: never = side;
      return exhaustive;
    }
  }
}

function spaceOn(side: Side, anchor: Rect, viewport: Size, offset: number, padding: number): number {
  switch (side) {
    case "top":
      return anchor.y - offset - padding;
    case "bottom":
      return viewport.height - (anchor.y + anchor.height) - offset - padding;
    case "left":
      return anchor.x - offset - padding;
    case "right":
      return viewport.width - (anchor.x + anchor.width) - offset - padding;
    default: {
      const exhaustive: never = side;
      return exhaustive;
    }
  }
}

function mainAxis(side: Side, anchor: Rect, floating: Size, offset: number): number {
  switch (side) {
    case "top":
      return anchor.y - floating.height - offset;
    case "bottom":
      return anchor.y + anchor.height + offset;
    case "left":
      return anchor.x - floating.width - offset;
    case "right":
      return anchor.x + anchor.width + offset;
    default: {
      const exhaustive: never = side;
      return exhaustive;
    }
  }
}

function crossAxis(
  align: Align,
  start: number,
  anchorLength: number,
  floatingLength: number,
  mirrored: boolean,
): number {
  const resolved: Align = mirrored && align !== "center" ? (align === "start" ? "end" : "start") : align;
  switch (resolved) {
    case "start":
      return start;
    case "center":
      return start + (anchorLength - floatingLength) / 2;
    case "end":
      return start + anchorLength - floatingLength;
    default: {
      const exhaustive: never = resolved;
      return exhaustive;
    }
  }
}

function clamp(value: number, min: number, max: number): number {
  if (max < min) return min;
  return Math.min(Math.max(value, min), max);
}

/**
 * Places a floating element next to an anchor. Pure: rects in, coordinates out.
 * Flips to the opposite side when the preferred side overflows and the other
 * side has more room, then shifts on the cross axis to stay inside the viewport.
 */
export function computePosition(options: ComputePositionOptions): Position {
  const {
    anchor,
    floating,
    viewport,
    side: preferred = "bottom",
    align = "center",
    sideOffset = 0,
    collisionPadding = 0,
    dir = "ltr",
  } = options;

  const vertical = isVertical(preferred);
  const needed = vertical ? floating.height : floating.width;
  const preferredSpace = spaceOn(preferred, anchor, viewport, sideOffset, collisionPadding);
  const flipped = opposite[preferred];
  const flippedSpace = spaceOn(flipped, anchor, viewport, sideOffset, collisionPadding);
  const side = needed > preferredSpace && flippedSpace > preferredSpace ? flipped : preferred;

  let x: number;
  let y: number;
  if (vertical) {
    y = mainAxis(side, anchor, floating, sideOffset);
    x = crossAxis(align, anchor.x, anchor.width, floating.width, dir === "rtl");
    x = clamp(x, collisionPadding, viewport.width - collisionPadding - floating.width);
  } else {
    x = mainAxis(side, anchor, floating, sideOffset);
    y = crossAxis(align, anchor.y, anchor.height, floating.height, false);
    y = clamp(y, collisionPadding, viewport.height - collisionPadding - floating.height);
  }

  const mainSpace = Math.max(0, spaceOn(side, anchor, viewport, sideOffset, collisionPadding));
  const crossWidth = Math.max(0, viewport.width - collisionPadding * 2);
  const crossHeight = Math.max(0, viewport.height - collisionPadding * 2);

  return {
    x: Math.round(x),
    y: Math.round(y),
    side,
    align,
    availableWidth: Math.round(vertical ? crossWidth : mainSpace),
    availableHeight: Math.round(vertical ? mainSpace : crossHeight),
    anchorWidth: Math.round(anchor.width),
    anchorHeight: Math.round(anchor.height),
  };
}

export function samePosition(a: Position | null, b: Position | null): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  return (
    a.x === b.x &&
    a.y === b.y &&
    a.side === b.side &&
    a.align === b.align &&
    a.availableWidth === b.availableWidth &&
    a.availableHeight === b.availableHeight &&
    a.anchorWidth === b.anchorWidth &&
    a.anchorHeight === b.anchorHeight
  );
}

export function getViewportSize(doc: Document): Size {
  const view = doc.defaultView;
  const root = doc.documentElement;
  return {
    width: root.clientWidth || view?.innerWidth || 0,
    height: root.clientHeight || view?.innerHeight || 0,
  };
}

/**
 * Re-runs `update` when the anchor or floating element may have moved:
 * scroll (any ancestor, captured on window), resize, and element resize.
 * Runs `update` once synchronously, then batches into animation frames.
 */
export function autoUpdate(anchor: HTMLElement, floating: HTMLElement, update: () => void): () => void {
  const view = anchor.ownerDocument.defaultView;
  if (!view) {
    update();
    return () => {};
  }

  let frame: number | undefined;
  const schedule = () => {
    if (frame !== undefined) return;
    frame = view.requestAnimationFrame(() => {
      frame = undefined;
      update();
    });
  };

  view.addEventListener("scroll", schedule, { capture: true, passive: true });
  view.addEventListener("resize", schedule);

  const Observer = (view as Window & typeof globalThis).ResizeObserver;
  const observer = typeof Observer === "function" ? new Observer(schedule) : undefined;
  observer?.observe(anchor);
  observer?.observe(floating);

  update();

  return () => {
    if (frame !== undefined) view.cancelAnimationFrame(frame);
    view.removeEventListener("scroll", schedule, { capture: true });
    view.removeEventListener("resize", schedule);
    observer?.disconnect();
  };
}
