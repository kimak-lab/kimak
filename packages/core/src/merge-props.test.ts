import { describe, expect, it } from "vitest";
import { mergeProps } from "./merge-props";

describe("mergeProps", () => {
  it("composes event handlers in source order", () => {
    const order: string[] = [];
    const merged = mergeProps(
      { onClick: () => order.push("a") },
      { onClick: () => order.push("b") },
    );
    (merged.onClick as () => void)();
    expect(order).toEqual(["a", "b"]);
  });

  it("concatenates className and merges style", () => {
    const merged = mergeProps(
      { className: "root", style: { color: "red", opacity: 1 } },
      { className: "open", style: { opacity: 0.5 } },
    );
    expect(merged.className).toBe("root open");
    expect(merged.style).toEqual({ color: "red", opacity: 0.5 });
  });

  it("concatenates class for non-React adapters", () => {
    const merged = mergeProps({ class: "root" }, { class: "open" });
    expect(merged.class).toBe("root open");
  });

  it("lets later defined values win", () => {
    const merged = mergeProps({ id: "a", role: "checkbox" }, { id: "b" });
    expect(merged.id).toBe("b");
    expect(merged.role).toBe("checkbox");
  });
});
