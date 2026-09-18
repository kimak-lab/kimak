import { afterEach, describe, expect, it, vi } from "vitest";
import { createCollection } from "./collection";
import {
  addDismissLayer,
  handleEscapeKey,
  handleInteractOutside,
  resetDismissStack,
} from "./dismiss";
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

describe("dismiss stack", () => {
  afterEach(() => {
    resetDismissStack();
  });

  it("only the top layer dismisses, and not when the target is inside", () => {
    const outer = vi.fn();
    const inner = vi.fn();
    addDismissLayer({ id: "outer", onDismiss: outer });
    addDismissLayer({ id: "inner", onDismiss: inner });

    const child = { id: "child" };
    const content = { contains: (node: unknown) => node === child };

    const inside = { target: child } as unknown as Event;
    handleInteractOutside(inside, { id: "outer", content: content as unknown as EventTarget });
    expect(outer).not.toHaveBeenCalled();
    expect(inner).not.toHaveBeenCalled();

    handleInteractOutside(inside, { id: "inner", content: content as unknown as EventTarget });
    expect(inner).not.toHaveBeenCalled();

    const outside = { target: { id: "body" } } as unknown as Event;
    handleInteractOutside(outside, { id: "inner", content: content as unknown as EventTarget });
    expect(inner).toHaveBeenCalledTimes(1);
    expect(outer).not.toHaveBeenCalled();
  });

  it("does not dismiss when the event is on an excluded node", () => {
    const onDismiss = vi.fn();
    addDismissLayer({ id: "dlg", onDismiss });
    const trigger = { id: "trigger" };
    const event = { target: trigger } as unknown as Event;
    handleInteractOutside(event, {
      id: "dlg",
      content: null,
      exclude: [trigger as unknown as EventTarget],
    });
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it("Escape dismisses only the top layer", () => {
    const outer = vi.fn();
    const inner = vi.fn();
    addDismissLayer({ id: "outer", onDismiss: outer });
    addDismissLayer({ id: "inner", onDismiss: inner });
    const event = { key: "Escape", preventDefault: vi.fn() } as unknown as KeyboardEvent;
    handleEscapeKey(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(inner).toHaveBeenCalledTimes(1);
    expect(outer).not.toHaveBeenCalled();
  });
});
