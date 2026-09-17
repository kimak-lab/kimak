import { describe, expect, it } from "vitest";
import { identityPropTypes } from "../types";
import { connectCheckbox } from "./checkbox.connect";
import { createCheckboxMachine } from "./checkbox.machine";

function api(props: Parameters<typeof createCheckboxMachine>[0] = { id: "cb" }) {
  const service = createCheckboxMachine(props);
  return {
    service,
    current: () => connectCheckbox(service, identityPropTypes),
  };
}

describe("checkbox connect", () => {
  it("starts unchecked and exposes the anatomy styling surface", () => {
    const { current } = api();
    const root = current().getRootProps();
    const control = current().getControlProps();
    expect(root["data-scope"]).toBe("checkbox");
    expect(root["data-slot"]).toBe("root");
    expect(root["data-state"]).toBe("unchecked");
    expect(control.role).toBe("checkbox");
    expect(control["aria-checked"]).toBe("false");
  });

  it("toggles uncontrolled state", () => {
    const { service, current } = api();
    current().toggle();
    expect(current().checked).toBe(true);
    expect(current().getControlProps()["data-state"]).toBe("checked");
    expect(current().getControlProps()["aria-checked"]).toBe("true");
    service.send({ type: "TOGGLE" });
    expect(current().checked).toBe(false);
  });

  it("emits onCheckedChange without mutating when controlled", () => {
    const seen: Array<boolean | "indeterminate"> = [];
    const { current } = api({
      id: "cb",
      checked: false,
      onCheckedChange: ({ checked }) => seen.push(checked),
    });
    current().toggle();
    expect(current().checked).toBe(false);
    expect(seen).toEqual([true]);
  });

  it("does not toggle when disabled", () => {
    const { current } = api({ id: "cb", disabled: true, defaultChecked: false });
    current().toggle();
    expect(current().checked).toBe(false);
  });

  it("reports mixed as indeterminate", () => {
    const { current } = api({ id: "cb", defaultChecked: "indeterminate" });
    expect(current().indeterminate).toBe(true);
    expect(current().getControlProps()["aria-checked"]).toBe("mixed");
    expect(current().getControlProps()["data-state"]).toBe("indeterminate");
  });
});
