import { describe, expect, it, vi } from "vitest";
import { buttonSpec } from "@kimak/spec";
import { identityPropTypes } from "../normalize";
import { dataAttrKeys, expectedDataAttrKeys, machineParts } from "../spec-contract";
import { connectButton } from "./button.connect";
import { createButtonMachine } from "./button.machine";

function api(props: Parameters<typeof createButtonMachine>[0] = { id: "btn" }) {
  const service = createButtonMachine(props);
  return {
    service,
    current: () => connectButton(service, identityPropTypes),
  };
}

describe("button connect", () => {
  it("defaults to type=button and exposes the anatomy styling surface", () => {
    const { current } = api();
    const root = current().getRootProps();
    expect(root["data-scope"]).toBe("button");
    expect(root["data-slot"]).toBe("root");
    expect(root.type).toBe("button");
    expect(root.disabled).toBeUndefined();
    expect(current().disabled).toBe(false);
    expect(current().loading).toBe(false);
  });

  it("emits exact spec data-* and aria on every machine part", () => {
    const { current } = api({
      id: "btn",
      disabled: true,
      loading: true,
    });
    const propsBySlot = {
      root: current().getRootProps(),
      indicator: current().getIndicatorProps(),
    };

    for (const [slot, part] of machineParts(buttonSpec.parts)) {
      const props = propsBySlot[slot as keyof typeof propsBySlot];
      expect(dataAttrKeys(props)).toEqual(expectedDataAttrKeys(part));
      if (part.role) {
        expect(props.role).toBe(part.role);
      }
      for (const attr of part.ariaAttrs ?? []) {
        expect(props).toHaveProperty(attr);
      }
    }
  });

  it("fires onPress from press() and click", () => {
    const onPress = vi.fn();
    const { current } = api({ id: "btn", onPress });
    current().press();
    expect(onPress).toHaveBeenCalledTimes(1);
    const onClick = current().getRootProps().onClick as () => void;
    onClick();
    expect(onPress).toHaveBeenCalledTimes(2);
  });

  it("does not fire onPress when disabled", () => {
    const onPress = vi.fn();
    const { current } = api({ id: "btn", disabled: true, onPress });
    current().press();
    expect(onPress).not.toHaveBeenCalled();
    expect(current().getRootProps().disabled).toBe(true);
    expect(current().getRootProps()["data-disabled"]).toBe("");
    expect(current().getRootProps()["aria-disabled"]).toBe(true);
  });

  it("does not fire onPress when loading", () => {
    const onPress = vi.fn();
    const preventDefault = vi.fn();
    const { current } = api({ id: "btn", loading: true, onPress });
    current().press();
    expect(onPress).not.toHaveBeenCalled();
    expect(current().getRootProps().disabled).toBeUndefined();
    expect(current().getRootProps()["data-loading"]).toBe("");
    expect(current().getRootProps()["aria-disabled"]).toBe(true);
    expect(current().getRootProps()["aria-busy"]).toBe(true);
    expect(current().getIndicatorProps()["data-loading"]).toBe("");
    const onClick = current().getRootProps().onClick as (event: {
      preventDefault: () => void;
    }) => void;
    onClick({ preventDefault });
    expect(preventDefault).toHaveBeenCalledTimes(1);
    expect(onPress).not.toHaveBeenCalled();
  });

  it("omits native disabled when focusableWhenDisabled", () => {
    const onPress = vi.fn();
    const preventDefault = vi.fn();
    const { current } = api({
      id: "btn",
      disabled: true,
      focusableWhenDisabled: true,
      onPress,
    });
    const root = current().getRootProps();
    expect(root.disabled).toBeUndefined();
    expect(root["data-disabled"]).toBe("");
    expect(root["aria-disabled"]).toBe(true);
    current().press();
    expect(onPress).not.toHaveBeenCalled();
    const onClick = root.onClick as (event: { preventDefault: () => void }) => void;
    onClick({ preventDefault });
    expect(preventDefault).toHaveBeenCalledTimes(1);
    expect(onPress).not.toHaveBeenCalled();
  });

  it("emits the kernel prop dialect adapters must remap", () => {
    const { current } = api();
    const root = current().getRootProps();
    expect(root).toHaveProperty("onClick");
    expect(root).toHaveProperty("ref");
  });

  it("forwards native form fields", () => {
    const { current } = api({
      id: "btn",
      type: "submit",
      name: "save",
      value: "1",
      form: "profile",
    });
    const root = current().getRootProps();
    expect(root.type).toBe("submit");
    expect(root.name).toBe("save");
    expect(root.value).toBe("1");
    expect(root.form).toBe("profile");
  });
});
