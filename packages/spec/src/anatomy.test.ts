import { describe, expect, it } from "vitest";
import { buttonAnatomy, buttonSpec } from "./button";
import { buttonGroupAnatomy } from "./button-group";
import { popoverAnatomy, popoverSpec } from "./popover";
import type { ComponentSpec, PartContract } from "./types";

function assertSpecIntegrity<TParts extends string>(
  spec: ComponentSpec<TParts>,
  parts: readonly TParts[],
) {
  expect(Object.keys(spec.parts)).toEqual([...parts]);

  const adapterSlots: string[] = [];
  for (const partName of parts) {
    const part = spec.parts[partName] as PartContract<TParts>;
    expect(part.slot).toBe(partName);
    if (part.dataAttrs.includes("data-state")) {
      expect(part.dataStates?.length).toBeGreaterThan(0);
    }
    if (part.owner === "adapter") {
      adapterSlots.push(partName);
    }
  }
  return adapterSlots;
}

describe("anatomy contract", () => {
  it("names every button part as a stable styling surface", () => {
    expect(buttonAnatomy.root.attrs()).toEqual({
      "data-scope": "button",
      "data-slot": "root",
    });
    expect(buttonAnatomy.indicator.selector).toBe(
      '[data-scope="button"][data-slot="indicator"]',
    );
    const adapters = assertSpecIntegrity(buttonSpec, buttonAnatomy.parts);
    expect(adapters).toEqual([]);
  });

  it("binds button keyboard to native Enter and Space on root", () => {
    expect(buttonSpec.keyboard).toEqual([
      expect.objectContaining({ code: "Enter", slot: "root" }),
      expect.objectContaining({ code: "Space", slot: "root" }),
    ]);
  });

  it("names every button group part as a look-only styling surface", () => {
    expect(buttonGroupAnatomy.parts).toEqual(["root", "separator", "text"]);
    expect(buttonGroupAnatomy.separator.selector).toBe(
      '[data-scope="button-group"][data-slot="separator"]',
    );
    expect(buttonGroupAnatomy.text.attrs()).toEqual({
      "data-scope": "button-group",
      "data-slot": "text",
    });
  });

  it("names every popover part and marks positioner/content as presence parts", () => {
    expect(popoverAnatomy.content.selector).toBe(
      '[data-scope="popover"][data-slot="content"]',
    );
    const adapters = assertSpecIntegrity(popoverSpec, popoverAnatomy.parts);
    expect(adapters).toEqual([]);
    expect(popoverSpec.presence.parts).toEqual(["positioner", "content"]);
  });

  it("binds popover keyboard to trigger toggle and content dismiss", () => {
    expect(popoverSpec.keyboard.map((binding) => [binding.code, binding.slot])).toEqual([
      ["Enter", "trigger"],
      ["Space", "trigger"],
      ["Escape", "content"],
      ["Tab", "content"],
    ]);
  });
});
