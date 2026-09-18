import { describe, expect, it } from "vitest";
import { normalizeProps } from "./normalize-props";

describe("normalizeProps", () => {
  it("remaps htmlFor to for", () => {
    expect(normalizeProps.label({ htmlFor: "input-id", id: "label-id" })).toEqual({
      for: "input-id",
      id: "label-id",
    });
  });

  it("remaps className to class", () => {
    expect(normalizeProps.button({ className: "rounded-full", type: "button" })).toEqual({
      class: "rounded-full",
      type: "button",
    });
  });

  it("preserves onClick and callback ref", () => {
    const onClick = () => {};
    const ref = () => {};
    expect(normalizeProps.button({ onClick, ref, "data-scope": "button" })).toEqual({
      onClick,
      ref,
      "data-scope": "button",
    });
  });
});
