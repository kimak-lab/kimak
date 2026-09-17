import { describe, expect, it } from "vitest";
import { checkboxAnatomy, checkboxSpec } from "./checkbox";
import { dialogAnatomy, dialogSpec } from "./dialog";

describe("anatomy contract", () => {
  it("names every checkbox part as a stable styling surface", () => {
    expect(checkboxAnatomy.control.attrs()).toEqual({
      "data-scope": "checkbox",
      "data-slot": "control",
    });
    expect(checkboxAnatomy.control.selector).toBe(
      '[data-scope="checkbox"][data-slot="control"]',
    );
    expect(Object.keys(checkboxSpec.parts)).toEqual([...checkboxAnatomy.parts]);
  });

  it("names every dialog part as a stable styling surface", () => {
    expect(dialogAnatomy.content.attrs()).toEqual({
      "data-scope": "dialog",
      "data-slot": "content",
    });
    expect(Object.keys(dialogSpec.parts)).toEqual([...dialogAnatomy.parts]);
  });
});
