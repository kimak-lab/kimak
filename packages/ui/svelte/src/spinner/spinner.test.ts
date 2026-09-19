import { describe, expect, it } from "vitest";
import { spinnerAttrs } from "./spinner-attrs";

describe("spinnerAttrs", () => {
  it("emits anatomy selectors", () => {
    expect(spinnerAttrs()).toEqual({
      "data-scope": "spinner",
      "data-slot": "root",
    });
  });
});
