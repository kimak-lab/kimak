import { describe, expect, it } from "vitest";
import { buttonGroupAttrs } from "./button-group-attrs";

describe("buttonGroupAttrs", () => {
  it("defaults orientation to horizontal", () => {
    expect(buttonGroupAttrs()).toEqual({
      "data-scope": "button-group",
      "data-slot": "root",
      "data-orientation": "horizontal",
    });
  });
});
