import { describe, expect, it, vi } from "vitest";
import { popoverSpec } from "@kimak/spec";
import { identityPropTypes } from "../normalize";
import { dataAttrKeys, expectedDataAttrKeys, machineParts } from "../spec-contract";
import { connectPopover } from "./popover.connect";
import { createPopoverMachine } from "./popover.machine";
import type { PopoverProps } from "./popover.types";

function api(props: PopoverProps = { id: "pop" }) {
  const service = createPopoverMachine(props);
  return {
    service,
    current: () => connectPopover(service, identityPropTypes),
  };
}

const position = {
  x: 10,
  y: 20,
  side: "top" as const,
  align: "start" as const,
  availableWidth: 300,
  availableHeight: 200,
  anchorWidth: 80,
  anchorHeight: 32,
};

describe("popover connect", () => {
  it("emits exact spec data-* and aria on every machine part", () => {
    const { current } = api({ id: "pop", defaultOpen: true });
    const propsBySlot = {
      trigger: current().getTriggerProps(),
      positioner: current().getPositionerProps(),
      content: current().getContentProps(),
      title: current().getTitleProps(),
      description: current().getDescriptionProps(),
      close: current().getCloseProps(),
    };

    for (const [slot, part] of machineParts(popoverSpec.parts)) {
      const props = propsBySlot[slot as keyof typeof propsBySlot];
      expect(dataAttrKeys(props)).toEqual(expectedDataAttrKeys(part));
      if (part.role) expect(props.role).toBe(part.role);
      for (const attr of part.ariaAttrs ?? []) expect(props).toHaveProperty(attr);
    }
  });

  it("starts closed and wires trigger aria to content", () => {
    const { current } = api();
    expect(current().open).toBe(false);
    const closed = current().getTriggerProps();
    expect(closed["aria-haspopup"]).toBe("dialog");
    expect(closed["aria-expanded"]).toBe(false);
    expect(closed["aria-controls"]).toBeUndefined();
    expect(closed["data-state"]).toBe("closed");

    (closed.onClick as () => void)();
    const open = current().getTriggerProps();
    expect(current().open).toBe(true);
    expect(open["aria-expanded"]).toBe(true);
    expect(open["aria-controls"]).toBe("pop:content");
    expect(current().getContentProps()["data-state"]).toBe("open");
  });

  it("toggles uncontrolled state and reports onOpenChange", () => {
    const onOpenChange = vi.fn();
    const { current } = api({ id: "pop", onOpenChange });
    current().setOpen(true);
    current().setOpen(true);
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    (current().getCloseProps().onClick as () => void)();
    expect(current().open).toBe(false);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it("follows the controlled open prop and only requests changes", () => {
    const onOpenChange = vi.fn();
    const { service, current } = api({ id: "pop", open: false, onOpenChange });
    current().setOpen(true);
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(current().open).toBe(false);
    service.setProps({ id: "pop", open: true, onOpenChange });
    expect(current().open).toBe(true);
  });

  it("uses the measured side and position, without notifying on equal positions", () => {
    const { service, current } = api({ id: "pop", defaultOpen: true, side: "bottom" });
    expect(current().side).toBe("bottom");
    expect(current().getPositionerProps().style).toMatchObject({ position: "fixed", transform: undefined });

    const listener = vi.fn();
    service.subscribe(listener);
    service.send({ type: "POSITION", position });
    service.send({ type: "POSITION", position: { ...position } });
    expect(listener).toHaveBeenCalledTimes(1);

    expect(current().side).toBe("top");
    expect(current().getContentProps()["data-side"]).toBe("top");
    expect(current().getPositionerProps().style).toMatchObject({
      transform: "translate3d(10px, 20px, 0)",
      "--kimak-available-height": "200px",
    });
  });

  it("labels content only by parts that are rendered", () => {
    const { service, current } = api({ id: "pop", defaultOpen: true });
    expect(current().getContentProps()["aria-labelledby"]).toBeUndefined();
    service.send({ type: "RENDERED", rendered: { title: true, description: false } });
    expect(current().getContentProps()["aria-labelledby"]).toBe("pop:title");
    expect(current().getContentProps()["aria-describedby"]).toBeUndefined();
  });

  it("emits the kernel prop dialect adapters must remap", () => {
    const { current } = api();
    const trigger = current().getTriggerProps();
    expect(trigger).toHaveProperty("onClick");
    expect(trigger).toHaveProperty("ref");
    expect(current().getPositionerProps()).toHaveProperty("style");
  });
});
