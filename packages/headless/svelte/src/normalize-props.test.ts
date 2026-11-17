import { describe, expect, it } from "vitest";
import { normalizeProps } from "./normalize-props";

describe("normalizeProps", () => {
  it("remaps htmlFor to for", () => {
    expect(normalizeProps.label({ htmlFor: "input-id" })).toEqual({ for: "input-id" });
  });

  it("remaps className to class", () => {
    expect(normalizeProps.button({ className: "rounded-full" })).toEqual({ class: "rounded-full" });
  });

  it("remaps React event keys to Svelte lowercase handlers", () => {
    const onClick = () => {};
    const onKeyDown = () => {};
    expect(normalizeProps.button({ onClick, onKeyDown, type: "button" })).toEqual({
      onclick: onClick,
      onkeydown: onKeyDown,
      type: "button",
    });
  });

  it("remaps tabIndex to tabindex", () => {
    expect(normalizeProps.element({ tabIndex: -1 })).toEqual({ tabindex: -1 });
  });

  it("serializes object style, keeps custom properties, and skips empty values", () => {
    expect(
      normalizeProps.element({
        style: {
          position: "fixed",
          minWidth: "max-content",
          transform: undefined,
          "--kimak-anchor-width": "120px",
        },
      }),
    ).toEqual({
      style: "position: fixed; min-width: max-content; --kimak-anchor-width: 120px",
    });
  });
});
