export interface DismissLayer {
  id: string;
  onDismiss: () => void;
  closeOnEscape?: boolean;
  closeOnInteractOutside?: boolean;
}

const stack: DismissLayer[] = [];

export function resetDismissStack(): void {
  stack.length = 0;
}

export function addDismissLayer(layer: DismissLayer): () => void {
  stack.push(layer);
  return () => {
    const index = stack.lastIndexOf(layer);
    if (index >= 0) stack.splice(index, 1);
  };
}

export function getTopDismissLayer(): DismissLayer | undefined {
  return stack[stack.length - 1];
}

export function isTopDismissLayer(id: string): boolean {
  return getTopDismissLayer()?.id === id;
}

export function handleEscapeKey(event: KeyboardEvent): void {
  if (event.key !== "Escape") return;
  const top = getTopDismissLayer();
  if (!top || top.closeOnEscape === false) return;
  event.preventDefault();
  top.onDismiss();
}

export function handleInteractOutside(
  event: Event,
  details: {
    id: string;
    content: EventTarget | null;
    exclude?: Array<EventTarget | null | undefined>;
  },
): void {
  const top = getTopDismissLayer();
  if (!top || top.id !== details.id || top.closeOnInteractOutside === false) return;

  const target = event.target;
  if (target) {
    const insides = [details.content, ...(details.exclude ?? [])];
    for (const node of insides) {
      if (containsTarget(node, target)) return;
    }
  }

  top.onDismiss();
}

function containsTarget(container: EventTarget | null | undefined, target: EventTarget): boolean {
  if (!container) return false;
  if (container === target) return true;
  const contains = (container as { contains?: (node: EventTarget) => boolean }).contains;
  return typeof contains === "function" && contains.call(container, target);
}
