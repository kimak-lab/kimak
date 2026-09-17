import { describe, expect, it } from "vitest";
import { splitProps } from "./split-props";

describe("splitProps", () => {
  it("picks listed keys without mutating the source", () => {
    const props = { checked: true, id: "cb", className: "root" };
    const [machine, rest] = splitProps(props, ["checked", "id"]);
    expect(machine).toEqual({ checked: true, id: "cb" });
    expect(rest).toEqual({ className: "root" });
    expect(props).toEqual({ checked: true, id: "cb", className: "root" });
  });
});
