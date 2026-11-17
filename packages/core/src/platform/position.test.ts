import { describe, expect, it } from "vitest";
import { computePosition, samePosition } from "./position";

const viewport = { width: 1000, height: 800 };
const anchor = { x: 400, y: 100, width: 100, height: 40 };
const floating = { width: 200, height: 150 };

describe("computePosition", () => {
  it("places below the anchor, centered, with the side offset", () => {
    const position = computePosition({ anchor, floating, viewport, sideOffset: 4 });
    expect(position).toMatchObject({ x: 350, y: 144, side: "bottom", align: "center" });
  });

  it("aligns start and end on the cross axis, mirrored in RTL", () => {
    expect(computePosition({ anchor, floating, viewport, align: "start" }).x).toBe(400);
    expect(computePosition({ anchor, floating, viewport, align: "end" }).x).toBe(300);
    expect(computePosition({ anchor, floating, viewport, align: "start", dir: "rtl" }).x).toBe(300);
    expect(computePosition({ anchor, floating, viewport, align: "end", dir: "rtl" }).x).toBe(400);
  });

  it("places on the left and right sides", () => {
    const right = computePosition({ anchor, floating, viewport, side: "right", sideOffset: 8 });
    expect(right).toMatchObject({ x: 508, side: "right" });
    const left = computePosition({ anchor, floating, viewport, side: "left", sideOffset: 8 });
    expect(left).toMatchObject({ x: 192, side: "left" });
  });

  it("flips to the opposite side when the preferred side overflows", () => {
    const low = { x: 400, y: 700, width: 100, height: 40 };
    const position = computePosition({ anchor: low, floating, viewport, sideOffset: 4 });
    expect(position.side).toBe("top");
    expect(position.y).toBe(700 - 150 - 4);
  });

  it("keeps the preferred side when neither side fits better", () => {
    const tall = { width: 200, height: 900 };
    expect(computePosition({ anchor, floating: tall, viewport }).side).toBe("bottom");
  });

  it("shifts on the cross axis to stay inside the collision padding", () => {
    const edge = { x: 0, y: 100, width: 40, height: 40 };
    expect(computePosition({ anchor: edge, floating, viewport, collisionPadding: 8 }).x).toBe(8);
    const right = { x: 980, y: 100, width: 20, height: 40 };
    expect(computePosition({ anchor: right, floating, viewport, collisionPadding: 8 }).x).toBe(792);
  });

  it("reports the available space on the main axis", () => {
    const position = computePosition({ anchor, floating, viewport, sideOffset: 4, collisionPadding: 8 });
    expect(position.availableHeight).toBe(800 - 140 - 4 - 8);
    expect(position.availableWidth).toBe(1000 - 16);
    expect(position.anchorWidth).toBe(100);
  });
});

describe("samePosition", () => {
  it("compares by value", () => {
    const a = computePosition({ anchor, floating, viewport });
    const b = computePosition({ anchor, floating, viewport });
    expect(samePosition(a, b)).toBe(true);
    expect(samePosition(a, { ...b, x: b.x + 1 })).toBe(false);
    expect(samePosition(null, b)).toBe(false);
  });
});
