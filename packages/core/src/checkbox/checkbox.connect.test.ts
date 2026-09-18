import { describe, expect, it, vi } from "vitest";
import { checkboxSpec } from "@kimak/spec";
import { identityPropTypes } from "../normalize";
import { dataAttrKeys, expectedDataAttrKeys, machineParts } from "../spec-contract";
import { connectCheckbox } from "./checkbox.connect";
import { createCheckboxMachine } from "./checkbox.machine";

function api(props: Parameters<typeof createCheckboxMachine>[0] = { id: "cb" }) {
  const service = createCheckboxMachine(props);
  return {
    service,
    current: () => connectCheckbox(service, identityPropTypes),
  };
}

function keyEvent(key: string) {
  return { key, preventDefault: vi.fn() } as unknown as KeyboardEvent;
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

  it("emits exact spec data-* and aria on every machine part", () => {
    const { current } = api({
      id: "cb",
      disabled: true,
      invalid: true,
      readOnly: true,
      required: true,
    });
    const propsBySlot = {
      root: current().getRootProps(),
      label: current().getLabelProps(),
      control: current().getControlProps(),
      indicator: current().getIndicatorProps(),
      hiddenInput: current().getHiddenInputProps(),
    };

    for (const [slot, part] of machineParts(checkboxSpec.parts)) {
      const props = propsBySlot[slot as keyof typeof propsBySlot];
      expect(dataAttrKeys(props)).toEqual(expectedDataAttrKeys(part));
      if (part.dataStates && props["data-state"] != null) {
        expect(part.dataStates).toContain(props["data-state"]);
      }
      if (part.role) {
        expect(props.role).toBe(part.role);
      }
      for (const attr of part.ariaAttrs ?? []) {
        expect(props).toHaveProperty(attr);
      }
    }
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

  it("emits the kernel prop dialect adapters must remap", () => {
    const { current } = api();
    const root = current().getRootProps();
    const control = current().getControlProps();
    const input = current().getHiddenInputProps();
    expect(root).toHaveProperty("htmlFor");
    expect(control).toHaveProperty("onClick");
    expect(control).toHaveProperty("onKeyDown");
    expect(input).toHaveProperty("onChange");
    expect(input).toHaveProperty("ref");
    expect(input).toHaveProperty("style");
  });

  it("stops control clicks from reaching the wrapping label", () => {
    const { current } = api();
    const onClick = current().getControlProps().onClick as (event: MouseEvent) => void;
    const event = { preventDefault: vi.fn(), stopPropagation: vi.fn() } as unknown as MouseEvent;
    onClick(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
    expect(current().checked).toBe(true);
  });

  it("toggles on Space and not on Enter", () => {
    const { current } = api();
    const onKeyDown = current().getControlProps().onKeyDown as (event: KeyboardEvent) => void;

    const enter = keyEvent("Enter");
    onKeyDown(enter);
    expect(enter.preventDefault).not.toHaveBeenCalled();
    expect(current().checked).toBe(false);

    const space = keyEvent(" ");
    onKeyDown(space);
    expect(space.preventDefault).toHaveBeenCalled();
    expect(current().checked).toBe(true);
  });
});
