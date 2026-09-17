import { describe, expect, it } from "vitest";
import { identityPropTypes } from "../types";
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
});
