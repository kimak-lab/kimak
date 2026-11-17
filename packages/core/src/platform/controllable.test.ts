import { describe, expect, it, vi } from "vitest";
import { requestControllable, resolveControllable } from "./controllable";

describe("resolveControllable", () => {
  it("falls back to the uncontrolled value only for undefined", () => {
    expect(resolveControllable(undefined, "a")).toBe("a");
    expect(resolveControllable<string | null>(null, "a")).toBeNull();
    expect(resolveControllable(false, true)).toBe(false);
    expect(resolveControllable(0, 5)).toBe(0);
  });
});

describe("requestControllable", () => {
  it("stores the next value and reports it when uncontrolled", () => {
    const onChange = vi.fn();
    const result = requestControllable({ controlled: undefined, uncontrolled: "a", next: "b", onChange });
    expect(result).toBe("b");
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("b");
  });

  it("is a no-op when the value does not change", () => {
    const onChange = vi.fn();
    const uncontrolled = ["a"];
    const result = requestControllable({ controlled: undefined, uncontrolled, next: uncontrolled, onChange });
    expect(result).toBe(uncontrolled);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("only requests the change when controlled", () => {
    const onChange = vi.fn();
    const result = requestControllable({ controlled: false, uncontrolled: false, next: true, onChange });
    expect(result).toBe(false);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("compares against the controlled value, not the stale uncontrolled one", () => {
    const onChange = vi.fn();
    const result = requestControllable({ controlled: true, uncontrolled: false, next: true, onChange });
    expect(result).toBe(false);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("honors a custom comparer for array values", () => {
    const uncontrolled = ["a"];
    const isEqual = (a: string[], b: string[]) => a.length === b.length && a.every((v, i) => v === b[i]);

    const same = vi.fn();
    expect(
      requestControllable({ controlled: undefined, uncontrolled, next: ["a"], onChange: same, isEqual }),
    ).toBe(uncontrolled);
    expect(same).not.toHaveBeenCalled();

    const byReference = vi.fn();
    const next = ["a"];
    expect(requestControllable({ controlled: undefined, uncontrolled, next, onChange: byReference })).toBe(next);
    expect(byReference).toHaveBeenCalledWith(next);
  });
});
