export type LivePoliteness = "polite" | "assertive";

let region: HTMLElement | null = null;

function getRegion(doc: Document): HTMLElement {
  if (region && region.isConnected) return region;
  const node = doc.createElement("div");
  node.setAttribute("aria-live", "polite");
  node.setAttribute("aria-atomic", "true");
  node.setAttribute("data-scope", "kimak");
  node.setAttribute("data-slot", "live-region");
  node.style.cssText =
    "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0";
  doc.body.append(node);
  region = node;
  return node;
}

export function announce(
  message: string,
  politeness: LivePoliteness = "polite",
  doc: Document = globalThis.document,
): void {
  if (!doc) return;
  const node = getRegion(doc);
  node.setAttribute("aria-live", politeness);
  node.textContent = "";
  node.textContent = message;
}
