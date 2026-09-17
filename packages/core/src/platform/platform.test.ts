import { describe, expect, it } from "vitest";
import { createCollection } from "./collection";
import { getNextRovingId } from "./roving-focus";
import { shouldMount } from "./presence";

describe("platform primitives", () => {
  it("filters a collection", () => {
    const collection = createCollection([
      { value: "a", label: "Alpha" },
      { value: "b", label: "Beta" },
    ]);
    expect(collection.search("be").map((item) => item.value)).toEqual(["b"]);
  });

  it("moves roving tabindex with RTL-aware arrows", () => {
    const items = ["one", "two", "three"];
    expect(getNextRovingId({ current: "two", items, dir: "ltr" }, "ArrowRight")).toBe("three");
    expect(getNextRovingId({ current: "two", items, dir: "rtl" }, "ArrowRight")).toBe("one");
    expect(getNextRovingId({ current: "one", items, loop: true }, "ArrowLeft")).toBe("three");
  });

  it("keeps presence mounted when forceMount is set", () => {
    expect(shouldMount({ present: false })).toBe(false);
    expect(shouldMount({ present: false, forceMount: true })).toBe(true);
  });
});
