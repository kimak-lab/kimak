import { describe, expect, it } from "vitest";
import { dialogSpec } from "@kimak/spec";
import { identityPropTypes } from "../types";
import { dataAttrKeys, expectedDataAttrKeys, machineParts } from "../spec-contract";
import { connectDialog } from "./dialog.connect";
import { createDialogMachine } from "./dialog.machine";

function api(props: Parameters<typeof createDialogMachine>[0] = { id: "dlg" }) {
  const service = createDialogMachine(props);
  return {
    service,
    current: () => connectDialog(service, identityPropTypes),
  };
}

describe("dialog connect", () => {
  it("starts closed with dialog anatomy on parts", () => {
    const { current } = api();
    expect(current().open).toBe(false);
    expect(current().getTriggerProps()["data-scope"]).toBe("dialog");
    expect(current().getTriggerProps()["aria-expanded"]).toBe(false);
    expect(current().getContentProps().role).toBe("dialog");
    expect(current().getContentProps()["data-state"]).toBe("closed");
  });

  it("emits exact spec data-* and aria on every machine part", () => {
    const { current } = api({ id: "dlg", disabled: true });
    const propsBySlot = {
      root: current().getRootProps(),
      trigger: current().getTriggerProps(),
      backdrop: current().getBackdropProps(),
      positioner: current().getPositionerProps(),
      content: current().getContentProps(),
      title: current().getTitleProps(),
      description: current().getDescriptionProps(),
      close: current().getCloseTriggerProps(),
    };

    for (const [slot, part] of machineParts(dialogSpec.parts)) {
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

  it("opens and closes through the machine", () => {
    const { current } = api();
    current().setOpen(true);
    expect(current().open).toBe(true);
    expect(current().getContentProps()["data-state"]).toBe("open");
    expect(current().getContentProps()["aria-modal"]).toBe(true);
    current().setOpen(false);
    expect(current().open).toBe(false);
  });

  it("emits onOpenChange without mutating when controlled", () => {
    const seen: boolean[] = [];
    const { current } = api({
      id: "dlg",
      open: false,
      onOpenChange: ({ open }) => seen.push(open),
    });
    current().setOpen(true);
    expect(current().open).toBe(false);
    expect(seen).toEqual([true]);
  });

  it("honors alertdialog role on content", () => {
    const { current } = api({ id: "dlg", role: "alertdialog" });
    expect(current().getContentProps().role).toBe("alertdialog");
  });
});
