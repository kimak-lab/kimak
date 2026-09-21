import { describe, expect, it } from "vitest";
import { buttonAttrs } from "./button-attrs";
import { bindButtonMotion } from "./button-motion";

describe("buttonAttrs", () => {
  it("emits anatomy selectors and look data attributes", () => {
    expect(buttonAttrs({ variant: "outline", size: "sm" })).toEqual({
      "data-scope": "button",
      "data-slot": "root",
      "data-variant": "outline",
      "data-size": "sm",
    });
  });

  it("lets explicit data-* win over variant and size", () => {
    expect(
      buttonAttrs({ variant: "ghost", "data-variant": "outline" })["data-variant"],
    ).toBe("outline");
  });

  it("does not emit motion as a look data attribute", () => {
    expect(buttonAttrs({ variant: "outline" })).toEqual({
      "data-scope": "button",
      "data-slot": "root",
      "data-variant": "outline",
    });
  });
});

describe("bindButtonMotion", () => {
  it("does not bind when the node is missing or motion is none", () => {
    expect(bindButtonMotion(null)).toBeUndefined();
    expect(bindButtonMotion(null, { motion: "none" })).toBeUndefined();
  });
});
