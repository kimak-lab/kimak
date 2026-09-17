import { describe, expect, it } from "vitest";
import { checkboxAnatomy, checkboxSpec } from "./checkbox";
import { dialogAnatomy, dialogSpec } from "./dialog";
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
  it("names every checkbox part as a stable styling surface", () => {
    expect(checkboxAnatomy.control.attrs()).toEqual({
      "data-scope": "checkbox",
      "data-slot": "control",
    });
    expect(checkboxAnatomy.control.selector).toBe(
      '[data-scope="checkbox"][data-slot="control"]',
    );
    const adapters = assertSpecIntegrity(checkboxSpec, checkboxAnatomy.parts);
    expect(adapters).toEqual([]);
  });

  it("names every dialog part as a stable styling surface", () => {
    expect(dialogAnatomy.content.attrs()).toEqual({
      "data-scope": "dialog",
      "data-slot": "content",
    });
    const adapters = assertSpecIntegrity(dialogSpec, dialogAnatomy.parts);
    expect(adapters).toEqual(["portal"]);
  });

  it("binds checkbox keyboard to Space on the control only", () => {
    expect(checkboxSpec.keyboard).toEqual([
      expect.objectContaining({ code: "Space", slot: "control", preventDefault: true }),
    ]);
  });
});
