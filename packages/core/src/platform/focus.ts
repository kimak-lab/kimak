const TABBABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function getTabbableCandidates(container: HTMLElement): HTMLElement[] {
  return [...container.querySelectorAll<HTMLElement>(TABBABLE)].filter((node) => {
    return !node.hasAttribute("disabled") && node.getAttribute("aria-hidden") !== "true";
  });
}

export function cycleTab(container: HTMLElement, event: KeyboardEvent): void {
  if (event.key !== "Tab") return;
  const items = getTabbableCandidates(container);
  if (items.length === 0) {
    event.preventDefault();
    container.focus();
    return;
  }

  const first = items[0];
  const last = items[items.length - 1];
  if (!first || !last) return;

  const active = container.ownerDocument.activeElement;
  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
    return;
  }
  if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}

export function lockScroll(doc: Document): () => void {
  const previous = doc.body.style.overflow;
  doc.body.style.overflow = "hidden";
  return () => {
    doc.body.style.overflow = previous;
  };
}

export function focusFirst(container: HTMLElement): void {
  const [first] = getTabbableCandidates(container);
  (first ?? container).focus();
}
