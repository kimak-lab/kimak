import { describe, expect, it } from "vitest";
import { createNormalizer, identityPropTypes, propTypeKeys } from "./normalize";
import type { Dict } from "./types";

describe("createNormalizer", () => {
  it("covers every prop-type tag", () => {
    expect(Object.keys(identityPropTypes).sort()).toEqual([...propTypeKeys].sort());
  });

  it("identity keeps the kernel dialect", () => {
    const click = () => undefined;
    const props = identityPropTypes.label({
      htmlFor: "field",
      onClick: click,
      style: { color: "red" },
    });
    expect(props.htmlFor).toBe("field");
    expect(props.onClick).toBe(click);
    expect(props.style).toEqual({ color: "red" });
  });

  it("lets an adapter remap kernel keys onto its vnode system", () => {
    const normalize = createNormalizer((props) => {
      const next: Dict = {};
      for (const [key, value] of Object.entries(props)) {
        const mapped = key === "htmlFor" ? "for" : key.startsWith("on") ? key.toLowerCase() : key;
        next[mapped] = value;
      }
      return next;
    });

    const click = () => undefined;
    const props = normalize.label({ htmlFor: "field", onClick: click });
    expect(props).toEqual({ for: "field", onclick: click });
  });
});
