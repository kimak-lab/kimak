import { describe, expect, it } from "vitest";
import { mergeProps } from "./merge-props";

describe("mergeProps", () => {
  it("joins string styles so consumer styles extend part styles", () => {
    expect(mergeProps({ style: "position: fixed; top: 0;" }, { style: "width: 18rem" }).style).toBe(
      "position: fixed; top: 0; width: 18rem",
    );
  });

  it("keeps a single style untouched", () => {
    expect(mergeProps({ style: "position: fixed" }, { id: "x" }).style).toBe("position: fixed");
  });

  it("composes callback refs", () => {
    const calls: string[] = [];
    const merged = mergeProps({ ref: () => calls.push("part") }, { ref: () => calls.push("user") });
    (merged.ref as (node: unknown) => void)(null);
    expect(calls).toEqual(["part", "user"]);
  });
});
